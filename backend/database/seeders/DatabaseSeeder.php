<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Amir Siraj',
            'username' => 'AEHJSS',
            'email' => 'amirsiraj1995@gmail.com',
            'password' => Hash::make('AEHJSS36'),
            'role' => 'admin',
            'is_active' => true,
        ]);
    }
}
