$(function () {
    var PAGE_SIZE = 5;
    var state = { page: 0, keyword: '' };
    var modal = new bootstrap.Modal(document.getElementById('formModal'));

    var Q_SEARCH = 'query($keyword: String, $page: Int, $size: Int) { searchProducts(keyword: $keyword, page: $page, size: $size) { totalElements totalPages page size content { id name price description category { id name } } } }';
    var Q_CATEGORIES = 'query { categories { id name } }';
    var M_CREATE = 'mutation($input: ProductInput!) { createProduct(input: $input) { id } }';
    var M_UPDATE = 'mutation($id: ID!, $input: ProductInput!) { updateProduct(id: $id, input: $input) { id } }';
    var M_DELETE = 'mutation($id: ID!) { deleteProduct(id: $id) }';

    function load() {
        gql(Q_SEARCH, { keyword: state.keyword, page: state.page, size: PAGE_SIZE }).done(function (data) {
            var result = data.searchProducts;
            if (result.page > 0 && result.content.length === 0 && result.totalPages > 0) {
                state.page = result.totalPages - 1;
                load();
                return;
            }
            var html = '';
            result.content.forEach(function (p) {
                html += '<tr>' +
                    '<td>' + esc(p.id) + '</td>' +
                    '<td>' + esc(p.name) + '</td>' +
                    '<td>' + fmtPrice(p.price) + '</td>' +
                    '<td>' + esc(p.category ? p.category.name : '') + '</td>' +
                    '<td>' + esc(p.description) + '</td>' +
                    '<td><button class="btn btn-sm btn-warning btn-edit me-1" data-id="' + esc(p.id) + '">Sửa</button>' +
                    '<button class="btn btn-sm btn-danger btn-delete" data-id="' + esc(p.id) + '">Xóa</button></td>' +
                    '</tr>';
            });
            $('#tableBody').html(html || '<tr><td colspan="6" class="text-center text-muted">Không có dữ liệu</td></tr>');
            renderPager(result.page, result.totalPages, result.totalElements);
        }).fail(function (err) { showAlert(err.message); });
    }

    function loadCategoryOptions(selectedId) {
        return gql(Q_CATEGORIES).done(function (data) {
            var html = '<option value="">Không có danh mục</option>';
            data.categories.forEach(function (c) {
                html += '<option value="' + esc(c.id) + '">' + esc(c.name) + '</option>';
            });
            $('#fCategory').html(html).val(selectedId || '');
        });
    }

    function openForm(product) {
        $('#modalError').text('');
        $('#modalTitle').text(product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm');
        $('#fId').val(product ? product.id : '');
        $('#fName').val(product ? product.name : '');
        $('#fPrice').val(product ? product.price : '');
        $('#fDescription').val(product ? product.description : '');
        loadCategoryOptions(product && product.category ? product.category.id : '').always(function () {
            modal.show();
        });
    }

    $('#btnAdd').on('click', function () { openForm(null); });

    $('#tableBody').on('click', '.btn-edit', function () {
        var id = $(this).data('id');
        gql('query($id: ID!) { product(id: $id) { id name price description category { id name } } }', { id: String(id) })
            .done(function (data) {
                if (data.product) { openForm(data.product); }
            }).fail(function (err) { showAlert(err.message); });
    });

    $('#tableBody').on('click', '.btn-delete', function () {
        var id = $(this).data('id');
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) { return; }
        gql(M_DELETE, { id: String(id) }).done(function () {
            showAlert('Đã xóa sản phẩm', 'success');
            load();
        }).fail(function (err) { showAlert(err.message); });
    });

    $('#btnSave').on('click', function () {
        var id = $('#fId').val();
        var priceText = $('#fPrice').val();
        var input = {
            name: $('#fName').val(),
            price: priceText === '' ? null : parseFloat(priceText),
            description: $('#fDescription').val(),
            categoryId: $('#fCategory').val() || null
        };
        if (!input.name.trim()) { $('#modalError').text('Tên sản phẩm không được để trống'); return; }
        if (input.price === null || isNaN(input.price) || input.price < 0) { $('#modalError').text('Giá sản phẩm không hợp lệ'); return; }
        var request = id ? gql(M_UPDATE, { id: String(id), input: input }) : gql(M_CREATE, { input: input });
        request.done(function () {
            modal.hide();
            showAlert(id ? 'Cập nhật thành công' : 'Thêm thành công', 'success');
            if (!id) { state.page = 0; }
            load();
        }).fail(function (err) { $('#modalError').text(err.message); });
    });

    $('#btnSearch').on('click', function () {
        state.keyword = $('#keyword').val();
        state.page = 0;
        load();
    });

    $('#keyword').on('keypress', function (e) {
        if (e.which === 13) { $('#btnSearch').click(); }
    });

    $('#btnReset').on('click', function () {
        $('#keyword').val('');
        state.keyword = '';
        state.page = 0;
        load();
    });

    $('#pager').on('click', 'a.page-link', function (e) {
        e.preventDefault();
        var target = parseInt($(this).data('page'), 10);
        if (isNaN(target) || target < 0) { return; }
        state.page = target;
        load();
    });

    load();
});
