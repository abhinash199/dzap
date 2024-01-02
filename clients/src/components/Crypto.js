import React, { useState, useEffect } from "react";
import axios from "axios";
//import react-icons
import { FaExchangeAlt } from "react-icons/fa";

const CryptoConverterForm = () => {
  //usestate hooks
  const [cryptoList, setCryptoList] = useState([]);
  const [sourceCrypto, setSourceCrypto] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("usd");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState();
  const [loading, setloading] = useState(true);

  //Base url
  const url = process.env.REACT_APP_API_BASE_URL;

  //useEffect hooks
  useEffect(() => {
    // Fetch the list of top 100 cryptocurrencies from the CoinGecko API
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

    // Fetch the list of supported cryptocurrencies from the CoinGecko API
    const fetchSupportedCurrencies = async () => {
      try {
        const response = await fetch(`${url}/supported`);
        const data = await response.json();
        setloading(false);
        setSupported(data);
      } catch (error) {
        console.error("Error fetching supported list:", error);
      }
    };

    //calling the function
    fetchCryptoList();
    fetchSupportedCurrencies();
  }, []);

  const handleConvert = () => {
    // Basic validation
    console.log(sourceCrypto, amount, targetCurrency);
    if (!sourceCrypto || !amount || isNaN(amount)) {
      setError("Please fill the required value.");
      return;
    } else {
      const data = JSON.stringify({
        sourceCrypto: sourceCrypto.toLowerCase(),
        amount: amount,
        targetCurrency: targetCurrency.toLowerCase(),
      });

      //post the data to the coingecko PI
      axios
        .post(`${url}/convert`, data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => setConvertedAmount(response.data))
        .catch((err) => console.log(err));
      setError(null);
    }
  };

  return (
    <div className="wrapper">
      {/* Top header section */}
      <div className="app-details">
        <img src="app-icon.svg" className="app-icon" />
        <h1 className="app-title">Currency Converter</h1>
      </div>
      <label htmlFor="amount">Amount:</label>
      <input
      type="text"
        maxLength={15}
        onKeyPress={(event) => {
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }}
       pattern="[0-9]*"
        id="amount"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        data-testid="amount-input"
        required
      />
      <div className="dropdowns">
        <div className="source">
          <p>From</p>
          <select
            id="from-currency-select"
            data-testid="from-select"
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
          <FaExchangeAlt size={22} />
        </div>
        <div className="target">
          <p>To</p>
          <select
            id="to-currency-select"
            data-testid="to-select"
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
      <button
        id="convert-button"
        data-testid="result"
        type="button"
        onClick={handleConvert}
      >
        Convert
      </button>
      {/* displaying error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* displaying the convertedAmount */}
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
