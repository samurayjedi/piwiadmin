<?php
namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use App\Models\AbstractModel;

abstract class AbstractSqlTable {
    protected $table;
    private $db;

    function __construct(string $table) {
        $this->table = $table;
        $this->db = DB::table($this->table);
    }

    public function orderBy(string $field, string $order) {
        $this->db->orderBy($field, $order);

        return $this;
    }

    public function limit(int $limit) {
        $this->db->limit($limit);

        return $this;
    }

    public function offset(int $offset) {
        $this->db->offset($offset);

        return $this;
    }

    public function where(string $field, string $operator, mixed $value) {
        $this->db->where($field, $operator, $value);

        return $this;
    }

    /**
     * @return array
     */
    public function get() {
        return $this->db->get();
    }

    /**
     * @return int
     */
    public function count() {
        return $this->db->count();
    }
}