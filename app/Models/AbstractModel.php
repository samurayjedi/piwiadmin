<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use Carbon\Carbon;

abstract class AbstractModel
{
    protected $table;
    public $id, $created_at, $updated_at;

    public function toArray() {
        return [
            'id' => $this->id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    public function exchangeArray(mixed $piwi) {
        $this->id = is_array($piwi) ? $piwi['id'] : $piwi->id;
        $this->created_at = is_array($piwi) ? $piwi['created_at'] : $piwi->created_at;
        $this->updated_at = is_array($piwi) ? $piwi['updated_at'] : $piwi->updated_at;
    }

    public function insert() {
        $this->created_at = Carbon::now();
        $this->updated_at = Carbon::now();
        $arr = array_diff_key($this->toArray(), array_flip(['id']));
        $fields = array_keys($arr);
        $values = array_values($arr);
        if (count($fields) !== count($values)) {
            throw new \Exception('When insert, fields and values must have the same count.');
        }

        try {
            $n = count($fields);
            $sql = sprintf('INSERT INTO %s ('.implode(',', array_fill(0, $n, '%s')).') VALUES('.implode(',', array_fill(0, $n, '?')).')', ...[
                $this->table,
                ...$fields,
            ]);
            DB::insert($sql, $values);
            $this->id = DB::getPdo()->lastInsertId();
        } catch(QueryException $e) {
            throw new \Exception('Ooops, a error has ocurred while inserting the new record: ' . $e->getMessage());
        }
    }

    public function update() {
        $this->updated_at = Carbon::now();
        $arr = array_diff_key($this->toArray(), array_flip(['id']));
        $fields = array_keys($arr);
        $values = array_values($arr);
        if (count($fields) !== count($values)) {
            throw new \Exception('When insert, fields and values must have the same count.');
        }

        try {
            $n = count($fields);
            $marks = array_fill(0, $n, '%s');
            $f = array_map(function($v) { return "$v=?"; }, $marks);
            $sql = sprintf("UPDATE %s SET ".implode(',', $f)." WHERE id=?", $this->table, ...$fields);
            DB::update($sql, [...$values, $this->id]);
        } catch(QueryException $e) {
            throw new \Exception('Ooops, a error has ocurred while updating the category: ' . $e->getMessage());
        }
    }

    public function delete() {
        try {
            $sql = sprintf('DELETE FROM %s WHERE id=?', $this->table);
            DB::delete($sql, [$this->id]);
        } catch(QueryException $e) {
            throw new \Exception('Ooops, a error has ocurred while deleting the category: ' . $e->getMessage());
        }
    }
}
