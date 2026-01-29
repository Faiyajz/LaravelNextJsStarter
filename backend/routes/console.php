<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Console\Scheduling\Schedule;

Artisan::command('inspire', function () {
    echo Inspiring::quote();
})->purpose('Display an inspiring quote');

app()->booted(function () {
    app(Schedule::class)
        ->command('sanctum:prune-expired --hours=24')
        ->daily();
});
