import React, { useEffect, useState } from "react";
import { Header } from "./Header";
import DataChart from "./DataChart";
import DataTable from "./DataTable";
import Loader from "./Loader";
import { checkAuthentication } from "../helpers/checkAuth";
import { postData, getData, deleteData } from "../helpers/axios";
import { errorMessage } from "../helpers/errorMessage";
import "../styles/dataset.css";

const GraphPage = () => {
  /* Muestra el usuario actual, tabla de datos y el gráfico x-y asociado 
  a dicha tabla */

  const endpoint = "graphs/";
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /*Verificación de autenticación de usuario */
  useEffect(() => {
    checkAuthentication()
      .then((response) => {
        setIsAuthenticated(response.authenticated);
        setUserEmail(response.userEmail);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUserEmail("");
      });

    setLoading(true);

    getData(endpoint)
      .then((response) => {
        setData((prevData) => [...prevData, ...response]);
        setError(null);
      })
      .catch((error) => {
        setError(errorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreateItem = () => {
    postData("graphs/create/")
      .then((response) => {
        setData([...data, response]);
        setError(null);
      })
      .catch((error) => {
        setError(errorMessage(error));
      });
  };

  const handleDelete = (id) => {
    // Llamada para eliminar el registro en el backend
    let delete_endpoint = `graphs/delete/${id}/`;

    deleteData(delete_endpoint)
      .then(() => {
        let newData = data.filter((el) => el.id !== id);
        setData(newData);
        setError(null);
      })
      .catch((error) => {
        setError(errorMessage(error));
      });
  };

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} userEmail={userEmail} />

      <div className="data-set">
        <div className="data-table">
          {data && (
            <DataTable
              data={data}
              onCreateItem={handleCreateItem}
              handleDelete={handleDelete}
            />
          )}

          {loading && <Loader />}
          {error && <p className="error">{error}</p>}
        </div>
        <div className="chart">
          <DataChart myData={data} />
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
