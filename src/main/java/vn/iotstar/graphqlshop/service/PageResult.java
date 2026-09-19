package vn.iotstar.graphqlshop.service;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PageResult<T> {
    private List<T> content;
    private int totalElements;
    private int totalPages;
    private int page;
    private int size;
}
