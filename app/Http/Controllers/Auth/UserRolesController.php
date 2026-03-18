<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use App\Models\Role;
use App\Http\Controllers\Pagination;

class UserRolesController extends Controller {
    public function main(int $page = 0, int $rows = 5): Response {
        $pager = Pagination::normalize('roles', $page, $rows, Role::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        /** ... */
        $roles = Role::orderBy('id', 'DESC')
          ->skip($offset)
          ->take($limit)
          ->get();

        return Inertia::render('Auth/Roles', [
            'roles' => $roles->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function add() {
        request()->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'required', 
                'string',
                function ($attribute, $value, $fail) {
                    if ($value !== Str::snake($value)) {
                        $fail(__('validation.snake_case', ['attribute' => $attribute]));
                    }
                },
                'unique:roles,slug'
            ],
            'capabilities' => 'required|array|min:1',
        ]);
        $role = new Role;
        $role->name = request()->get('name');
        $role->slug = request()->get('slug');
        $role->capabilities = json_encode(request()->get('capabilities'));
        $role->save();

        return back();
    }

    public function update(int $id) {
        request()->validate([
            'name' => 'required|string|max:255',
            'capabilities' => 'required|array|min:1',
        ]);
        $role = Role::findOrFail($id);
        $role->name = request()->get('name');
        $role->capabilities = json_encode(request()->get('capabilities'));
        $role->save();

        return back();
    }

    public function delete(int $id) {
        $role = Role::findOrFail($id);
        $role->delete();

        return back();
    }
}
