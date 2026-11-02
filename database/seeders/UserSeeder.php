<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data akun Admin
        User::updateOrCreate(
            ['email' => 'admin@booksales.test'],
            [
                'name' => 'Admin BookSales',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Data akun Customer
        User::updateOrCreate(
            ['email' => 'customer@booksales.test'],
            [
                'name' => 'Customer John Doe',
                'password' => Hash::make('customer123'),
                'role' => 'customer',
            ]
        );
    }
}
