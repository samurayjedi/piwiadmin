<?php
namespace App\Models;

use ArrayAccess;
use IteratorAggregate;
use Traversable;
use ArrayIterator;

class Collection implements ArrayAccess, IteratorAggregate {
    private array $items = [];

    // 1. ArrayAccess Methods (Enable $obj[] = 'value')
    public function offsetExists(mixed $offset): bool {
        return isset($this->items[$offset]);
    }

    public function offsetGet(mixed $offset): mixed {
        return $this->items[$offset] ?? null;
    }

    public function offsetSet(mixed $offset, mixed $value): void {
        if ($offset === null) {
            $this->items[] = $value; // Handles $obj[] = 'value'
        } else {
            $this->items[$offset] = $value;
        }
    }

    public function offsetUnset(mixed $offset): void {
        unset($this->items[$offset]);
    }

    // 2. IteratorAggregate (Enable foreach)
    public function getIterator(): Traversable {
        return new ArrayIterator($this->items);
    }

    // 3. Bonus: Helper Methods
    public function count(): int {
        return count($this->items);
    }

    public function toArray(): array {
        $rawArr = [];
        foreach ($this->items as $item) {
            $rawArr[] = $item->toArray();
        }

        return $rawArr;
    }
}