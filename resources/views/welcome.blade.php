@extends('layouts.main')

@section('content')
<div class="row justify-content-center text-center py-5">
    <div class="col-lg-8">
        <h1 class="display-5 fw-bold text-dark mb-3">Book Sales</h1>
        <p class="lead text-secondary mb-5">
            Sistem informasi data buku untuk mengelola data Genre dan Penulis (Author).
        </p>

        <div class="row g-4 text-start">
            <!-- Card Genre -->
            <div class="col-md-6">
                <div class="card h-100 shadow-sm border-0 border-top border-primary border-4 rounded-3 p-3">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-primary-subtle text-primary p-3 rounded-circle me-3">
                                <i class="bi bi-tags fs-3"></i>
                            </div>
                            <div>
                                <h4 class="card-title fw-bold mb-0">Genre</h4>
                                <span class="badge bg-secondary-subtle text-secondary">5 Data</span>
                            </div>
                        </div>
                        <p class="card-text text-muted">
                            Daftar kategori dan genre buku yang tersedia.
                        </p>
                        <a href="{{ route('genres.index') }}" class="btn btn-primary w-100">
                            Lihat Genre <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Card Author -->
            <div class="col-md-6">
                <div class="card h-100 shadow-sm border-0 border-top border-success border-4 rounded-3 p-3">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-success-subtle text-success p-3 rounded-circle me-3">
                                <i class="bi bi-people fs-3"></i>
                            </div>
                            <div>
                                <h4 class="card-title fw-bold mb-0">Author</h4>
                                <span class="badge bg-secondary-subtle text-secondary">5 Data</span>
                            </div>
                        </div>
                        <p class="card-text text-muted">
                            Daftar penulis buku beserta biodata.
                        </p>
                        <a href="{{ route('authors.index') }}" class="btn btn-success w-100">
                            Lihat Author <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
