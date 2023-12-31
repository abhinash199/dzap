

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaExchangeAlt } from "react-icons/fa";
const CryptoConverterForm = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [sourceCrypto, setSourceCrypto] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("usd");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState();
  const [loading, setloading] = useState(true);

  const url =process.env.REACT_APP_API_BASE_URL;
  
  useEffect(() => {
    // Fetch the list of cryptocurrencies from the CoinGecko API
    const fetchCryptoList = async () => {
      try {
        const response = await fetch(`${url}/top100`);
        const data = await response.json();
        setloading(false);
        setCryptoList(data);
      } catch (error) {
        console.error("Error fetching cryptocurrency list:", error);
      }
    };

    const fetchSupportedCurrencies = async () => {
      try {
        const response = await fetch(
          `${url}/supported`
        );
        const data = await response.json();
        setloading(false);
        setSupported(data);
      } catch (error) {
        console.error("Error fetching supported list:", error);
      }
    };

    fetchCryptoList();
    fetchSupportedCurrencies();
  }, []);
  const handleConvert = () => {
    // Basic validation
    console.log(sourceCrypto,amount,targetCurrency)
    if (!sourceCrypto || !amount || isNaN(amount)) {
      setError("Please fill the required value.");
      return;
    } else {
      const data = JSON.stringify({
        sourceCrypto: sourceCrypto.toLowerCase(),
        amount: amount,
        targetCurrency: targetCurrency.toLowerCase(),
      });
      console.log(data);
      axios
        .post(`${url}/convert`, data, {
          headers: { "Content-Type": "application/json" },
        })
        // .then((res)=>console.log(res,"myyyyyyyy"))
        .then((response) => setConvertedAmount(response.data)).catch((err)=>console.log(err))
      setError(null);
    }
  };

  return (
    <div className="wrapper">
      <div className="app-details">
        <img src="app-icon.svg" className="app-icon" />
        <h1 className="app-title">Currency Converter</h1>
      </div>
      <label htmlFor="amount">Amount:</label>
      <input
        type="number"
        id="amount"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        required
      />
      <div className="dropdowns">
        <div className="source">
          <p>From</p>
          <select
            id="from-currency-select"
            onChange={(e) => setSourceCrypto(e.target.value)}
            value={sourceCrypto}
            required
            style={{ backgroundImage: "url(arrow-down.svg)" }}
          >
            {!loading &&
              cryptoList &&
              cryptoList.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </option>
              ))}
          </select>
        </div>
        <div className="icon">
          <FaExchangeAlt size={24} />
        </div>
        <div className="target">
          <p>To</p>
          <select
            id="to-currency-select"
            onChange={(e) => setTargetCurrency(e.target.value)}
            value={targetCurrency}
            required
            style={{ backgroundImage: "url(arrow-down.svg)" }}
          >
            <option value="usd">USD</option>
            {!loading &&
              supported &&
              supported.map((crypto) => (
                <option key={crypto} value={crypto}>
                  {crypto.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </div>
      <button id="convert-button" type="btton" onClick={handleConvert}>
        Convert
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {convertedAmount !== null && (
        <p id="result">
          {convertedAmount.amount} {convertedAmount.sourceCrypto.toUpperCase()}{" "}
          = {convertedAmount.convertedAmount.toFixed(2)}{" "}
          {convertedAmount.targetCurrency.toUpperCase()}
        </p>
      )}
    </div>
  );
};

export default CryptoConverterForm;
