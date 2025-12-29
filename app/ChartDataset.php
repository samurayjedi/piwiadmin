<?php
namespace App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Carbon\Carbon;
use App\Models\Sale;
use App\Models\Product;
use App\Models\SaleItem;
use App\Models\Client;
use App\Models\User;
use App\Models\Category;
use App\Models\Brand;

class ChartDataset {
    private $filter, $chart, $timeframe, $date;
    private $table, $select = [], $query, $leftJoin = [], $groupBy = [], $created_at = 'sales.created_at';

    public static function builder() {
        return new ChartDataset;
    }

    public function chartType(string $type) {
        switch ($type) {
            case 'bar':
            case 'line':
            case 'scatter':
            case 'pie':
                $this->chart = $type;
                break;
            default:
                throw new \RuntimeException("Invalid chart type '$type'.");
        }

        return $this;
    }

    public function filtering(string $salesFiltering) {
        $this->filter = $salesFiltering;
        switch ($this->filter) {
            case 'sales_by_type':
                $this->table = Sale::class;
                if ($this->chart === 'scatter') {
                    $this->select[] = 'payment_type';
                    $this->select[] = 'total_amount';
                    $this->select[] = 'amount_paid';
                    $this->select[] = 'created_at';
                } else {
                    $this->select[] = DB::raw('COALESCE(SUM(CASE WHEN payment_type=\'cash\' THEN total_amount END), 0) as cash');
                    $this->select[] = DB::raw('COALESCE(SUM(CASE WHEN payment_type=\'credit\' THEN total_amount END), 0) as credit');
                    $this->select[] = DB::raw('COALESCE(SUM(CASE WHEN payment_type=\'layaway\' THEN total_amount END), 0) as layaway');
                    $this->select[] = DB::raw('COALESCE(SUM(amount_paid), 0) AS revenue');
                    $this->select[] = DB::raw('COALESCE(SUM(CASE WHEN payment_type IN (\'credit\', \'layaway\') THEN total_amount - amount_paid END), 0) AS pending_revenue');
                }
                break;
            case 'sales_by_category':
            case 'sales_by_brand':
                $this->table = $this->filter === 'sales_by_category' ? Category::class : Brand::class;
                $column = $this->filter === 'sales_by_category' ? 'category' : 'brand';
                $this->select[] = $column.'_slug';
                $this->select[] = $column.'_label';
                $this->select[] = DB::raw('COALESCE(SUM(sale_items.quantity), 0) AS sale_count');
                $this->select[] = DB::raw('COALESCE(SUM(sale_items.unit_price * sale_items.quantity), 0) AS revenue');
                $this->select[] = 'sales.status';
                $this->leftJoin[] = ['products', $column.'_slug', '=', "products.$column"];
                $this->leftJoin[] = ['sale_items', 'products.id', '=', 'sale_items.product_id'];
                $this->leftJoin[] = ['sales', 'sale_items.sale_id', '=', 'sales.id'];
                $this->groupBy = [$column.'_slug', $column.'_label', 'sales.status'];
                $this->created_at = 'sale_items.created_at';
                if ($this->chart === 'scatter') {
                    $this->select[] = $this->created_at;
                    $this->groupBy[] = $this->created_at;
                }
                break;
            case 'sales_by_client':
            case 'sales_by_user':
                $this->table = Sale::class;
                $table = $this->filter === 'sales_by_client' ? 'clients' : 'users';
                $column = $this->filter === 'sales_by_client' ? 'client_id' : 'user_id';
                $this->select[] = "$table.id";
                $this->select[] = "$table.name";
                if ($this->chart === 'scatter') {
                    $this->select[] = 'total_amount';
                    $this->select[] = 'amount_paid';
                } else {
                    $this->select[] = DB::raw('COALESCE(SUM(sales.total_amount), 0) AS total');
                    $this->select[] = DB::raw('COALESCE(SUM(sales.amount_paid), 0) AS revenue');
                    $this->select[] = DB::raw('COALESCE(SUM(CASE WHEN sales.payment_type IN (\'credit\', \'layaway\') THEN sales.total_amount - sales.amount_paid ELSE 0 END), 0) AS pending_revenue');
                }
                $this->leftJoin[] = [$table, "sales.$column", '=', "$table.id"];
                $this->groupBy = ["$table.id", "$table.name"];
                if ($this->chart === 'scatter') {
                    $this->select[] = $this->created_at;
                    $this->groupBy[] = $this->created_at;
                    $this->groupBy[] = 'total_amount';
                    $this->groupBy[] = 'amount_paid';
                }
                break;
            default:
                throw new \RuntimeExeption("Invalid filtering method '$salesFiltering'.");
        }

        return $this;
    }

    public function timeframe(string $type, Carbon $sales_date) {
        $this->date = $sales_date;
        switch ($type) {
            case 'sales_by_month':
            case 'sales_by_day':
                $this->timeframe = $type;
                if ($this->chart === 'bar' || $this->chart === 'line') {
                    $this->select[] = DB::raw("MONTH($this->created_at) AS month");
                    if ($type === 'sales_by_day') {
                        $this->select[] = DB::raw("DAY($this->created_at) AS day");
                    }
                }
                break;
            default:
                throw new \RuntimeException("Invalid timeframe '$type'.");
        }

        return $this;
    }

    public function query() {
        $this->query = $this->table::select($this->select);
        /** leftJoin */
        if (count($this->leftJoin)) {
            foreach ($this->leftJoin as $join) {
                $this->query->leftJoin(...$join);
            }
        }
        /** groupBy */
        if ($this->chart === 'bar' || $this->chart === 'line') {
            $this->groupBy[] = DB::raw("MONTH($this->created_at)");
            if ($this->timeframe === 'sales_by_day') {
                $this->groupBy[] = DB::raw("DAY($this->created_at)");
            }
        }
        if (count($this->groupBy)) {
            $this->query->groupBy($this->groupBy);
        }
        /** where */
        $this->query->whereNot('sales.status', 'canceled');
        $this->query->whereYear($this->created_at, $this->date->year);
        if ($this->timeframe === 'sales_by_day') {
            $this->query->whereMonth($this->created_at, $this->date->month);
        }
        /** orderby */
        if ($this->chart === 'bar' || $this->chart === 'line') {
            $this->query->orderBy('month');
            if ($this->timeframe === 'sales_by_day') {
                $this->query->orderBy('day');
            }
        }

        return $this;
    }

    public function get() {
        $dataset = []; $datasetLabels = [];
        $thi_s = $this;
        switch ($this->filter) {
            case 'sales_by_type':
                $dataset = $this->query->get()->map(function($item) use($thi_s, &$datasetLabels) {
                    $arr = [];
                    foreach ($item->toArray() as $key => $v) {
                        if (in_array($key, ['created_at', 'day', 'month', 'payment_type'])) {
                            $arr[$key] = $v;
                        } else {
                            $arr[$key] = (float)$v;
                        }
                    }
                    $thi_s->filter0($arr);
                    $thi_s->translatedMonthDay($thi_s->date->year, $item->month, $item->day, $arr);

                    return $arr;
                })->toArray();
                $datasetLabels = [
                    'cash' => __('Cash'),
                    'credit' => __('Credit'),
                    'layaway' => __('Layaway'),
                ];
                break;
            case 'sales_by_category':
            case 'sales_by_brand':
                if ($this->chart === 'scatter') {
                    $dataset = $this->query->get()->map(function ($item) use($thi_s, &$datasetLabels) {
                        $column = $thi_s->filter === 'sales_by_category' ? 'category' : 'brand';
                        $datasetLabels[$item->{$column.'_slug'}] = $item->{$column.'_label'};

                        return [
                            ...($item->toArray()),
                            'revenue' => (float)$item->revenue,
                            'sale_count' => (float)$item->sale_count,
                        ];
                    })->toArray();
                } else {
                    $datasetDirty = $this->query->get()->map(function($item) use($thi_s, &$datasetLabels) {
                        $column = $thi_s->filter === 'sales_by_category' ? 'category' : 'brand';
                        $arr = [];
                        if ($thi_s->chart === 'pie') {
                            $arr = [
                                $item->{$column.'_slug'}.'_revenue' => (float)$item->revenue,
                                $item->{$column.'_slug'}.'_sale_count' => (float)$item->sale_count,
                            ];
                        } else {
                            $arr = [
                                ...Arr::except($item->toArray(), [$column.'_slug', $column.'_label', 'revenue', 'sale_count', 'status']),
                                $item->{$column.'_slug'} => (float)$item->revenue,
                                'revenue' => (float)$item->revenue,
                                'sale_count' => (float)$item->sale_count,
                            ];
                        }
                        $thi_s->translatedMonthDay($thi_s->date->year, $item->month, $item->day, $arr);
                        $datasetLabels[$item->{$column.'_slug'}] = $item->{$column.'_label'};

                        return $arr;
                    })->toArray();
                    if ($this->chart === 'pie') {
                        $dataset[] = array_merge(...$datasetDirty);
                    } else {
                        $dataset = array_reduce($datasetDirty, [$this, 'reduce']) ?? [];
                    }
                    foreach ($dataset as &$arr) {
                        $this->filter0($arr);
                    }
                }
                break;
            case 'sales_by_client':
            case 'sales_by_user':
                if ($this->chart === 'scatter') {
                    $dataset = $this->query->get()->map(function($item) use(&$datasetLabels) {
                        $datasetLabels['#'.$item->id] = $item->name;
                        
                        return [
                            ...($item->toArray()),
                            'total_amount' => (float)$item->total_amount,
                            'amount_paid' => (float)$item->amount_paid,
                        ];
                    })->toArray();
                } else {
                    $total = 0; $pending = 0;
                    $datasetDirty = $this->query->get()->map(function($item) use($thi_s, &$datasetLabels, &$total, &$pending) {
                        $datasetLabels['#'.$item->id] = $item->name;
                        $arr = [
                            ...Arr::except($item->toArray(), ['total', 'id', 'name', 'revenue', 'pending_revenue']),
                            '#'.$item->id => (float)$item->total,
                        ];
                        if ($thi_s->chart === 'bar' || $thi_s->chart === 'line') {
                            $arr['revenue'] = (float)$item->revenue;
                            $arr['pending_revenue'] = (float)$item->pending_revenue;
                            $thi_s->translatedMonthDay($thi_s->date->year, $item->month, $item->day ?? null, $arr);
                        } else {
                            $total += $item->revenue;
                            $pending += $item->pending_revenue;
                        }
                        $thi_s->filter0($arr);

                        return $arr;
                    })->toArray();
                    if ($this->chart === 'scatter') {
                        $dataset = $datasetDirty;
                    } else {
                        if ($this->chart === 'pie') {
                            $dataset[] = array_merge(...$datasetDirty);
                            $dataset[0]['revenue'] = (float)$total;
                            $dataset[0]['pending_revenue'] = (float)$pending;
                        } else {
                            $dataset = array_reduce($datasetDirty, [$this, 'reduce']) ?? [];
                        }
                    }
                }
                break;
            default:
                throw new RuntimeException('Not implemented.');
        }

        return [$dataset, $datasetLabels];
    }

    private function translatedMonthDay($year, $month, $day, array &$arr) {
        if ($this->chart === 'bar' || $this->chart === 'line') {
            $arr['month'] = Carbon::create($this->date->year, $month)->translatedFormat('M');
            if ($this->timeframe === 'sales_by_day') {
                $carbon = Carbon::create($this->date->year, $month, $day);
                $arr['day'] = $carbon->translatedFormat('D') . " " . $day;
            }
        }
    }

    private function filter0(&$arr) {
        foreach ($arr as $key => $value) {
            if ($value == 0) {
                unset($arr[$key]);
            }
        }
    }

    private function reduce($carry, $item) {
        if (!$carry) {
            return [$item];
        }
        $key = $this->timeframe === 'sales_by_day' ? 'day' : 'month';
        foreach ($carry as &$jItem) {
            if ($jItem[$key] === $item[$key]) {
                $keys = ['revenue', 'pending_revenue', 'sale_count'];
                $exceptArr = array_filter($item, function($key) use ($keys) {
                    return !in_array($key, $keys);
                }, ARRAY_FILTER_USE_KEY);
                $jItem = array_merge($jItem, $exceptArr);
                foreach ($keys as $key) {
                    if (array_key_exists($key, $jItem)) {
                        if (array_key_exists($key, $item)) {
                            $jItem[$key] += (float)$item[$key];
                        }
                    } else if (array_key_exists($key, $item)) {
                        $jItem[$key] = (float)$item[$key];
                    }
                }

                return $carry;
            }
        }
        $carry[] = $item;
        
        return $carry;
    }
}