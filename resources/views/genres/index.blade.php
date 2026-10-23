@extends('layouts.main')

@section('content')
<div class="row mb-4">
    <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h2 class="fw-bold text-dark mb-0">
                    <i class="bi bi-tags-fill text-primary me-2"></i>Daftar Genre Buku
                </h2>
            </div>
            <span class="badge bg-primary px-3 py-2 fs-6 rounded-pill">
                Total: {{ count($genres) }} Data
            </span>
        </div>
    </div>
</div>

<div class="card shadow-sm border-0 rounded-3">
    <div class="card-header bg-white py-3 border-bottom">
        <h5 class="card-title mb-0 fw-semibold text-secondary">
            <i class="bi bi-table me-2"></i>Data Genre
        </h5>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th class="text-center" style="width: 80px;">No</th>
                        <th style="width: 250px;">Nama Genre</th>
                        <th>Deskripsi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($genres as $index => $genre)
                        <tr>
                            <td class="text-center fw-semibold text-muted">
                                {{ $loop->iteration ?? ($index + 1) }}
                            </td>
                            <td>
                                <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1 fs-6">
                                    <i class="bi bi-tag me-1"></i>{{ $genre['name'] ?? $genre->name }}
                                </span>
                            </td>
                            <td class="text-secondary">
                                {{ $genre['description'] ?? $genre->description }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="3" class="text-center py-4 text-muted">
                                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                Belum ada data genre.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
