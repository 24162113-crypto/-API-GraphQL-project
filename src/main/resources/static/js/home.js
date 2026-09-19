$(function () {
    var QUERY_ALL = 'query { productsByPriceAsc { id name price description category { id name } } }';
    var QUERY_BY_CATEGORY = 'query($categoryId: ID!) { productsByCategory(categoryId: $categoryId) { id name price description category { id name } } }';
    var QUERY_CATEGORIES = 'query { categories { id name } }';

    function renderProducts(products) {
        if (!products.length) {
            $('#productList').html('<div class="col-12 text-muted">Không có sản phẩm nào</div>');
            return;
        }
        var html = '';
        products.forEach(function (p) {
            html += '<div class="col-md-4 col-lg-3">' +
                '<div class="card h-100 shadow-sm"><div class="card-body">' +
                '<h5 class="card-title">' + esc(p.name) + '</h5>' +
                '<span class="badge bg-secondary mb-2">' + esc(p.category ? p.category.name : 'Chưa phân loại') + '</span>' +
                '<p class="card-text text-muted">' + esc(p.description) + '</p>' +
                '</div><div class="card-footer fw-bold text-danger">' + fmtPrice(p.price) + '</div></div></div>';
        });
        $('#productList').html(html);
    }

    function loadProducts() {
        var categoryId = $('#categoryFilter').val();
        var request;
        if (categoryId) {
            request = gql(QUERY_BY_CATEGORY, { categoryId: categoryId }).then(function (d) { return d.productsByCategory; });
            $('#listTitle').text('Sản phẩm theo danh mục: ' + $('#categoryFilter option:selected').text());
        } else {
            request = gql(QUERY_ALL).then(function (d) { return d.productsByPriceAsc; });
            $('#listTitle').text('Tất cả sản phẩm (giá tăng dần)');
        }
        request.done(renderProducts).fail(function (err) { showAlert(err.message); });
    }

    gql(QUERY_CATEGORIES).done(function (data) {
        data.categories.forEach(function (c) {
            $('#categoryFilter').append('<option value="' + esc(c.id) + '">' + esc(c.name) + '</option>');
        });
    }).fail(function (err) { showAlert(err.message); });

    $('#categoryFilter').on('change', loadProducts);
    loadProducts();
});
