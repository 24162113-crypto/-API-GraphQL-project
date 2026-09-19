$(function () {
    var PAGE_SIZE = 5;
    var state = { page: 0, keyword: '' };
    var modal = new bootstrap.Modal(document.getElementById('formModal'));

    var Q_SEARCH = 'query($keyword: String, $page: Int, $size: Int) { searchCategories(keyword: $keyword, page: $page, size: $size) { totalElements totalPages page size content { id name } } }';
    var M_CREATE = 'mutation($input: CategoryInput!) { createCategory(input: $input) { id } }';
    var M_UPDATE = 'mutation($id: ID!, $input: CategoryInput!) { updateCategory(id: $id, input: $input) { id } }';
    var M_DELETE = 'mutation($id: ID!) { deleteCategory(id: $id) }';

    function load() {
        gql(Q_SEARCH, { keyword: state.keyword, page: state.page, size: PAGE_SIZE }).done(function (data) {
            var result = data.searchCategories;
            if (result.page > 0 && result.content.length === 0 && result.totalPages > 0) {
                state.page = result.totalPages - 1;
                load();
                return;
            }
            var html = '';
            result.content.forEach(function (c) {
                html += '<tr>' +
                    '<td>' + esc(c.id) + '</td>' +
                    '<td>' + esc(c.name) + '</td>' +
                    '<td><button class="btn btn-sm btn-warning btn-edit me-1" data-id="' + esc(c.id) + '" data-name="' + esc(c.name) + '">Sửa</button>' +
                    '<button class="btn btn-sm btn-danger btn-delete" data-id="' + esc(c.id) + '">Xóa</button></td>' +
                    '</tr>';
            });
            $('#tableBody').html(html || '<tr><td colspan="3" class="text-center text-muted">Không có dữ liệu</td></tr>');
            renderPager(result.page, result.totalPages, result.totalElements);
        }).fail(function (err) { showAlert(err.message); });
    }

    function openForm(id, name) {
        $('#modalError').text('');
        $('#modalTitle').text(id ? 'Cập nhật danh mục' : 'Thêm danh mục');
        $('#fId').val(id || '');
        $('#fName').val(name || '');
        modal.show();
    }

    $('#btnAdd').on('click', function () { openForm(null, ''); });

    $('#tableBody').on('click', '.btn-edit', function () {
        openForm($(this).attr('data-id'), $(this).attr('data-name'));
    });

    $('#tableBody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        if (!confirm('Bạn có chắc muốn xóa danh mục này?')) { return; }
        gql(M_DELETE, { id: id }).done(function () {
            showAlert('Đã xóa danh mục', 'success');
            load();
        }).fail(function (err) { showAlert(err.message); });
    });

    $('#btnSave').on('click', function () {
        var id = $('#fId').val();
        var input = { name: $('#fName').val() };
        if (!input.name.trim()) { $('#modalError').text('Tên danh mục không được để trống'); return; }
        var request = id ? gql(M_UPDATE, { id: id, input: input }) : gql(M_CREATE, { input: input });
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
