<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Http\Controllers\Pagination;

class CategoriesController extends Controller {
    public function main(int $page = 0, int $rows = 5) {
        $pager = Pagination::normalize('categories', $page, $rows, Category::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        /** ... */
        $categories = Category::orderBy('id', 'DESC')
          ->skip($offset)
          ->take($limit)
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

        $category = new Category;
        $category->category_label = $request->get('category_label');
        $category->category_slug = $request->get('category_slug');
        $category->save();
        
        return back();
    }

    public function update(Request $request, int $id) {
        $request->validate([
            'category_label' => 'required|string|max:255',
        ]);

        $category = Category::findOrFail($id);
        $category->category_label = $request->get('category_label');
        $category->save();
        
        return back();
    }

    
  public function delete(int $id) {
    $category = Category::findOrFail($id);
    $category->delete();

    return back();
  }
}
