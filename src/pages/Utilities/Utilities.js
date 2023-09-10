import classNames from 'classnames/bind';
import styles from './Utilities.module.scss';

import { SearchIcon } from '../../components/Icon';
import Scroll from '../../components/Scroll';
import Button from '../../components/Button';
import ModalInsert from './ModalInsert/ModalInsert';

import { Table } from 'react-bootstrap';

import React, { useState, useEffect } from 'react';
import Paginate from '../../components/Paginate/Paginate';
import { utilitiesApi } from '../../apis';
import ModalUpdate from './ModalUpdate/ModalUpdate';

const cx = classNames.bind(styles);

function Utilities() {
    const [searchItem, setSearchItem] = useState('');
    const [listItems, setlistItems] = useState([]);
    const [pageCount, setPageCount] = useState(10);

    const [pageNumber, setPageNumber] = useState(1);
    const itemsPerPage = 2;

    const getListUtilities = async (page, searchString = '') => {
        const res = await utilitiesApi.getAllUtilities(page, itemsPerPage, searchString);
        setlistItems(res.data.data);
    };

    const getTotalUtilities = async (searchString = '') => {
        const res = await utilitiesApi.getAllUtilitiesSearch((searchString = ''));
        setPageCount(Math.ceil(res.data.data.length / itemsPerPage));
    };

    useEffect(() => {
        getListUtilities(pageNumber, searchItem);
        getTotalUtilities(searchItem);
    }, [pageNumber, searchItem]);

    const setCurrentPage = (event) => {
        setPageNumber(event + 1);
    };

    const handleChangeSearch = (e) => {
        setSearchItem(e.target.value);
    };

    // model
    const [showUpdate, setShowUpdate] = useState(false);

    const handleCloseUpdate = () => setShowUpdate(false);
    const handleShowUpdate = () => setShowUpdate(true);
    // model
    const [showInsert, setShowInsert] = useState(false);

    const handleCloseInsert = () => setShowInsert(false);
    const handleShowInsert = () => setShowInsert(true);

    // get user
    const [idItem, setIdItem] = useState();
    const [nameItem, setNameItem] = useState();
    const [desc, setDesc] = useState();
    const handleGetUser = (index, name, description) => {
        handleShowUpdate();
        setIdItem(index);
        setNameItem(name);
        setDesc(description);
    };
    // delete item
    const deleteItem = async (id) => {
        await utilitiesApi.deleteUtilities(id);
    };
    const handleDelete = (id) => {
        deleteItem(id);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>DANH SÁCH LOẠI PHÒNG</div>
            <div className={cx('search')}>
                <input
                    placeholder="Tìm kiếm..."
                    className={cx('input')}
                    value={searchItem}
                    onChange={handleChangeSearch}
                />
                <SearchIcon className={cx('icon')} />
            </div>
            <div className={cx('content')}>
                <Table striped bordered responsive className={cx('table')}>
                    <thead className={cx('title-table')}>
                        <tr className={cx('wrapper-header')}>
                            <th className={cx('size-1', 'center', 'title-item')}>STT</th>
                            <th className={cx('size-2', 'center', 'title-item')}>Tên tiện ích</th>
                            <th className={cx('size-3', 'center', 'title-item')}>Mô tả</th>
                            <th className={cx('size-2', 'center', 'title-item')}>Hình ảnh</th>
                            <th className={cx('size-2', 'center', 'title-item')}></th>
                        </tr>
                    </thead>
                    <tbody className={cx('data-table')}>
                        {listItems.map((item, index) => (
                            <tr key={index} className={cx('wrapper-header')}>
                                <td className={cx('size-1', 'center', 'item')}>{index + 1}</td>
                                <td className={cx('size-2', 'item')}>{item.name}</td>
                                <td className={cx('size-3', 'center', 'item')}>{item.description}</td>
                                <td className={cx('size-2', 'center', 'item')}></td>
                                <td className={cx('size-2', 'center', 'item')}>
                                    <Button
                                        className={cx('btn-small')}
                                        filled_1
                                        onClick={() => handleGetUser(item._id, item.name, item.description)}
                                    >
                                        Sửa
                                    </Button>
                                    <ModalUpdate
                                        handleClose={handleCloseUpdate}
                                        show={showUpdate}
                                        itemName={nameItem}
                                        itemDesc={desc}
                                        itemID={idItem}
                                    />
                                    <Button className={cx('btn-small')} filled_1 onClick={() => handleDelete(item._id)}>
                                        Xóa
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className={cx('wrapper-btn')}>
                    <Button className={cx('btn')} filled_1 onClick={handleShowInsert}>
                        Thêm
                    </Button>
                    <ModalInsert handleClose={handleCloseInsert} show={showInsert} />
                </div>
                <Paginate pageCount={pageCount} setCurrentPage={setCurrentPage} />
            </div>
            <Scroll />
        </div>
    );
}

export default Utilities;
