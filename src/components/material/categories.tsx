import * as React from "react";
import "./app.css";
import { Category } from "models/search/Search";
import { GetCategories } from "components/backend-api/api";

interface CardProps {
  title: string;
  src: string;
  price: number;
}

export const Categories = (props?: any) => {
  const [data, setData] = React.useState<Category[]>([]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetch() {
      const response = await GetCategories("some_token");
      setData(response.result);
      setLoading(false);
    }

    fetch();
  }, []);

  return (
    <>
      {loading ? (
        "xui"
      ) : (
        <div className="col-lg-3">
          <h3 className="h4 lined text-uppercase mb-4">Категории</h3>
          <ul className="nav flex-column nav-pills mb-4">
            {data.map((d) => (
              <li className="nav-item">
                <a className="nav-link" href={"http://localhost:3000?page=1&per_page=50&category=" + d.name}>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold text-uppercase">{d.name}</span>
                    <div className="badge bg-warning">{d.count}  </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};