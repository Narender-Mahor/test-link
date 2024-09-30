import { GetProducts } from "@/store/slices/GetProducts";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import ReactPaginate from "react-paginate";

const Products = () => {
  const dispatch = useDispatch();
  const [selectCategory, setSelectCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 10;

  const { data: productData, loading } = useSelector((state) => ({
    data: state.ProductData.data?.data?.products || [],
    loading: state.ProductData.loading,
  }));

  useEffect(() => {
    dispatch(GetProducts());
  }, [dispatch]);

  const categories = Array.from(
    new Set(productData.map((res) => res?.category))
  );

  const categoryOptions = [
    { value: null, label: "All Products" },
    ...categories.map((category) => ({
      value: category,
      label: category,
    })),
  ];

  // Filter products by both category and search term
  const filteredProducts = productData.filter((product) => {
    const matchesCategory = selectCategory
      ? selectCategory.value === null ||
        product.category === selectCategory.value
      : true;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate the total number of products after filtering
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectCategory]);

  // Calculate the products for the current page
  const indexOfFirstProduct = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfFirstProduct + productsPerPage
  );

  return (
    <>
      <div className="container">
        <h1 className=" mt-5">Products</h1>
        <div>
          <Select
            placeholder="Select category"
            options={categoryOptions}
            isClearable
            onChange={(selectOption) => setSelectCategory(selectOption)}
            value={selectCategory}
          />
        </div>
        <div className="my-3">
          {/* Search input field */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div class="lds-hourglass"></div>
            {/* You can replace this with a spinner or a loading animation */}
          </div>
        ) : (
          <div className="row">
            {currentProducts?.map((item, i) => (
              <div key={i} className="col-md-3">
                <div className="card my-3 px-3 py-3 shadow">
                  <div>
                    <h5>{item.title}</h5>
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="card-image-top"
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                    <div>
                      <p>$: {item.price}</p>
                      <p>Category: {item.category}</p>
                      <p>Description: {item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination controls using react-paginate */}
        {!loading && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={10}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        )}
      </div>
    </>
  );
};

export default Products;
