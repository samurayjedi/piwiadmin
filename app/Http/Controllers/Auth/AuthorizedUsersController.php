<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use App\Models\Role;
use App\Models\AuthorizedUser;
use App\Http\Controllers\Pagination;

class AuthorizedUsersController extends Controller {
    public function main(int $page = 0, int $rows = 5): Response {
        $roles = Role::all();
        /** Authorized users pagination */
        $pager = Pagination::normalize('authorized_users', $page, $rows, AuthorizedUser::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $authorizedUsers = AuthorizedUser::with(['role'])
            ->orderBy('id', 'DESC')
            ->skip($offset)
            ->take($limit)
            ->get();

        /** Returns */
        return Inertia::render('Auth/AuthorizedUsers', [
            'roles' => $roles->toArray(),
            'authorized_users' => $authorizedUsers->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function add() {
        request()->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'role' => 'required|exists:roles,slug',
        ]);
        $authorizedUser = new AuthorizedUser;
        $authorizedUser->email = request()->get('email');
        $authorizedUser->name = request()->get('name');
        $authorizedUser->role_slug = request()->get('role');
        $authorizedUser->save();

        back();
    }

    public function update(int $id) {
        request()->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'role' => 'required|exists:roles,slug',
        ]);
        $authorizedUser = AuthorizedUser::findOrFail($id);
        $authorizedUser->email = request()->get('email');
        $authorizedUser->name = request()->get('name');
        $authorizedUser->role_slug = request()->get('role');
        $authorizedUser->save();

        back();
    }

    public function delete(int $id) {
        $authorizedUser = AuthorizedUser::findOrFail($id);
        $authorizedUser->delete();

        back();
    }
}