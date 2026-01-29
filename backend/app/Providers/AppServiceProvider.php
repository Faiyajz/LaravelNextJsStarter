<?php

namespace App\Providers;

use App\Models\BuyerProfile;
use App\Models\Fabric;
use App\Models\Supplier;
use App\Policies\Buyers\BuyerPolicy;
use App\Policies\Fabrics\FabricPolicy;
use App\Policies\Notes\NotePolicy;
use App\Policies\Suppliers\SupplierPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Supplier::class, SupplierPolicy::class);
        Gate::policy(Fabric::class, FabricPolicy::class);
        Gate::policy(BuyerProfile::class, BuyerPolicy::class);

        Gate::define('notes.create.supplier', [NotePolicy::class, 'createForSupplier']);
        Gate::define('notes.create.fabric', [NotePolicy::class, 'createForFabric']);

        RateLimiter::for('auth', function (Request $request) {
            $limit = (int) config('security.rate_limits.auth_per_minute', 5);
            $email = (string) $request->input('email', '');
            $key = $email !== '' ? strtolower($email) . '|' . $request->ip() : $request->ip();

            return Limit::perMinute($limit)->by($key);
        });

        RateLimiter::for('api', function (Request $request) {
            $limit = (int) config('security.rate_limits.api_per_minute', 60);
            $userId = optional($request->user())->id;
            $key = $userId ? "user:{$userId}" : $request->ip();

            return Limit::perMinute($limit)->by($key);
        });
    }
}
