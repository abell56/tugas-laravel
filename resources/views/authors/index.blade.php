@extends('layouts.main')

@section('content')
<div class="row mb-4">
    <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h2 class="fw-bold text-dark mb-0">
                    <i class="bi bi-people-fill text-primary me-2"></i>Daftar Penulis (Author)
                </h2>
            </div>
            <span class="badge bg-primary px-3 py-2 fs-6 rounded-pill">
                Total: {{ count($authors) }} Data
            </span>
        </div>
    </div>
</div>

<div class="card shadow-sm border-0 rounded-3">
    <div class="card-header bg-white py-3 border-bottom">
        <h5 class="card-title mb-0 fw-semibold text-secondary">
            <i class="bi bi-table me-2"></i>Data Penulis
        </h5>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th class="text-center" style="width: 80px;">No</th>
                        <th class="text-center" style="width: 100px;">Foto</th>
                        <th style="width: 250px;">Nama Penulis</th>
                        <th>Biodata</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($authors as $index => $author)
                        <tr>
                            <td class="text-center fw-semibold text-muted">
                                {{ $loop->iteration ?? ($index + 1) }}
                            </td>
                            <td class="text-center">
                                <div class="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle" style="width: 45px; height: 45px;" title="{{ $author['photo'] ?? $author->photo }}">
                                    <i class="bi bi-person-fill fs-4"></i>
                                </div>
                                <div class="small text-muted mt-1" style="font-size: 0.75rem;">
                                    {{ $author['photo'] ?? $author->photo }}
                                </div>
                            </td>
                            <td>
                                <span class="fw-bold text-dark d-block">
                                    {{ $author['name'] ?? $author->name }}
                                </span>
                            </td>
                            <td class="text-secondary">
                                {{ $author['bio'] ?? $author->bio }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="text-center py-4 text-muted">
                                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                Belum ada data author.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
