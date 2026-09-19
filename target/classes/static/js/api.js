function gql(query, variables) {
    return $.ajax({
        url: '/graphql',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({ query: query, variables: variables || {} })
    }).then(function (res) {
        if (res.errors && res.errors.length) {
            return $.Deferred().reject(new Error(res.errors[0].message)).promise();
        }
        return res.data;
    }, function (xhr) {
        return $.Deferred().reject(new Error('Không kết nối được máy chủ (' + xhr.status + ')')).promise();
    });
}

function esc(value) {
    return String(value === null || value === undefined ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function fmtPrice(value) {
    return new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
}

function showAlert(message, type) {
    $('#alertBox').html('<div class="alert alert-' + (type || 'danger') + ' alert-dismissible fade show">' +
        esc(message) + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>');
}

function renderPager(page, totalPages, totalElements) {
    var html = '';
    if (totalPages > 1) {
        html += '<li class="page-item' + (page === 0 ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="' + (page - 1) + '">«</a></li>';
        for (var i = 0; i < totalPages; i++) {
            html += '<li class="page-item' + (i === page ? ' active' : '') + '"><a class="page-link" href="#" data-page="' + i + '">' + (i + 1) + '</a></li>';
        }
        html += '<li class="page-item' + (page >= totalPages - 1 ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="' + (page + 1) + '">»</a></li>';
    }
    $('#pager').html(html);
    $('#pageInfo').text('Tổng: ' + totalElements + ' bản ghi');
}
