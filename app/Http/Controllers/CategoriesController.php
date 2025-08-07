<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Categories\Category;
use App\Models\Categories\CategoryTable;
use App\Http\Controllers\Pagination;

class CategoriesController extends Controller {
    public function main(int $page = 0, int $rows = 5) {
        $table = new CategoryTable;
        $pager = Pagination::normalize('categories', $page, $rows, $table->count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        /** ... */
        $categories = $table
          ->limit($limit)
          ->offset($offset)
          ->get();

        return Inertia::render('Categories', [
            'categories' => $categories->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'category_label' => 'required|string|max:255',
            'category_slug' => 'required|string|unique:categories,category_slug',
        ]);

        $category = new Category();
        $category->category_label = $request->get('category_label');
        $category->category_slug = $request->get('category_slug');
        $category->insert();
        
        return back();
    }

    public function update(Request $request, int $id) {
        $request->validate([
            'category_label' => 'required|string|max:255',
        ]);

        $table = new CategoryTable;
        $categories = $table->where('id', '=', $id)->get();
        $category = $categories[0];
        $category->category_label = $request->get('category_label');
        $category->update();
        
        return back();
    }

    
  public function delete(int $id) {
    $table = new CategoryTable;
    $categories = $table->where('id', '=', $id)->get();
    $category = $categories[0];
    $category->delete();

    return back();
  }
}
