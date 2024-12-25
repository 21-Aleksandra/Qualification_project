import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { getAllAddressList } from "../../api/AddressAPI";
import { Spinner, Alert } from "react-bootstrap";
import AddressFilter from "../../components/Sections/AddressHelperTableSections/AddressHelperTableFilter/AddressHelperTableFilter";
import AddressHelperTableList from "../../components/Sections/AddressHelperTableSections/AddressHelperTableList/AddressHelperTableList";
import "./AddressListPage.css";

const AddressListPage = observer(() => {
  const { address } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    selectedCountries: [],
    selectedCities: [],
    street: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllAddressList();

        address.setAddresses(response || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError("Failed to load addresses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [address]);

  const filteredAddresses = address.addresses.filter((addr) => {
    const matchesCountry =
      !filters.selectedCountries.length ||
      filters.selectedCountries.includes(addr.country);
    const matchesCity =
      !filters.selectedCities.length ||
      filters.selectedCities.includes(addr.city);
    const matchesStreet =
      !filters.street ||
      addr.street.toLowerCase().includes(filters.street.toLowerCase());

    return matchesCountry && matchesCity && matchesStreet;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div id="address-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert id="address-error" variant="danger" className="my-5 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <div className="container mt-3">
      <div className="address-page-wrapper">
        <div className="address-list-container">
          {filteredAddresses.length === 0 ? (
            <div className="no-addresses-message">No addresses found</div>
          ) : (
            <AddressHelperTableList addresses={filteredAddresses} />
          )}
        </div>
        <div className="address-additional-components">
          <div className="filter-panel-container">
            <AddressFilter onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default AddressListPage;
