@extends('layouts.main')

@section('content')
<div class="row mb-4">
    <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h2 class="fw-bold text-dark mb-0">
                    <i class="bi bi-book-fill text-primary me-2"></i>Daftar Buku (Book)
                </h2>
            </div>
            <span class="badge bg-primary px-3 py-2 fs-6 rounded-pill">
                Total: {{ count($books) }} Data
            </span>
        </div>
    </div>
</div>

<div class="card shadow-sm border-0 rounded-3">
    <div class="card-header bg-white py-3 border-bottom">
        <h5 class="card-title mb-0 fw-semibold text-secondary">
            <i class="bi bi-table me-2"></i>Data Katalog Buku
        </h5>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th class="text-center" style="width: 70px;">No</th>
                        <th class="text-center" style="width: 110px;">Cover</th>
                        <th>Judul / Deskripsi Buku</th>
                        <th style="width: 200px;">Penulis (Author)</th>
                        <th style="width: 150px;">Genre</th>
                        <th style="width: 140px;">Harga</th>
                        <th class="text-center" style="width: 90px;">Stok</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($books as $index => $book)
                        <tr>
                            <td class="text-center fw-semibold text-muted">
                                {{ $loop->iteration ?? ($index + 1) }}
                            </td>
                            <td class="text-center">
                                <div class="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 p-2" style="width: 45px; height: 55px;" title="{{ $book->cover_photo }}">
                                    <i class="bi bi-file-earmark-image fs-4"></i>
                                </div>
                                <div class="small text-muted mt-1" style="font-size: 0.7rem;">
                                    {{ $book->cover_photo }}
                                </div>
                            </td>
                            <td>
                                <span class="fw-bold text-dark d-block">
                                    {{ $book->description }}
                                </span>
                            </td>
                            <td>
                                <span class="badge bg-success-subtle text-success-emphasis border border-success-subtle px-2 py-1 fs-6">
                                    <i class="bi bi-person-fill me-1"></i>{{ $book->author->name ?? 'Author #' . $book->author_id }}
                                </span>
                            </td>
                            <td>
                                <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1 fs-6">
                                    <i class="bi bi-tag me-1"></i>{{ $book->genre->name ?? 'Genre #' . $book->genre_id }}
                                </span>
                            </td>
                            <td>
                                <span class="fw-semibold text-primary">
                                    Rp {{ number_format($book->price, 0, ',', '.') }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="badge bg-secondary rounded-pill px-3 py-2">
                                    {{ $book->stock }} pcs
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center py-4 text-muted">
                                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                Belum ada data buku.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
