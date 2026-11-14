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
        // 1. Akun Admin BookSales
        User::updateOrCreate(
            ['email' => 'admin@booksales.test'],
            [
                'name' => 'Admin BookSales',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // 2. Akun Customer BookSales
        User::updateOrCreate(
            ['email' => 'customer@booksales.test'],
            [
                'name' => 'Customer John Doe',
                'password' => Hash::make('customer123'),
                'role' => 'customer',
            ]
        );

        // 3. Akun Admin Demo Bookstore
        User::updateOrCreate(
            ['email' => 'admin@bookstore.id'],
            [
                'name' => 'Administrator Bookstore',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // 4. Akun User Demo Bookstore
        User::updateOrCreate(
            ['email' => 'budi.santoso@gmail.com'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('user123'),
                'role' => 'customer',
            ]
        );
    }
}
