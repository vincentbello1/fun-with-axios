import http from "http";
import axios, { AxiosInstance } from "axios";
import createAuthInterceptor from "axios-auth-refresh";

class Service {
  private readonly axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://weatherapi-com.p.rapidapi.com",
      headers: {
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    });
    createAuthInterceptor(this.axiosInstance, this.refreshToken.bind(this));
  }
  private async refreshToken() {
    this.axiosInstance.defaults.headers.common["X-RapidAPI-Key"] =
      "8bc25910f9msh4c89a25a6d6c342p19eda7jsn6bb0cb07bb7e";
    console.log("Refreshing token");
  }
  async getSports(city: string) {
    return await this.axiosInstance({
      method: "GET",
      url: "sports.json",
      params: { q: city },
    });
  }
}

const PORT = 5050;

const server = http.createServer(async (req, res) => {
  if (req.url === "/api" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    const service = new Service();
    try {
      const axiosResp = await service.getSports("Montreal");
      res.end(JSON.stringify(axiosResp.data.football));
    } catch (error) {
      res.end(JSON.stringify(error));
    }
  } else if (req.url.includes("/clients")) {
    console.log(req.headers);
    if (
      req.headers["x-token"] ===
      "5a895b841c5f42bd58ac4341b7706e20891191481e5e20b2ab29a3a241808c6e"
    ) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          data: [
            {
              can_be_edited: true,
              id: 3,
              name: "Don Williams",
              email: "hhhhhh@gmail.com",
              phone: "+15145556789",
              address1: "",
              address2: "",
              city: "",
              zip: "",
              country_id: "CA",
              state_id: null,
              full_address: "CA",
            },
          ],
          metadata: {
            items_count: 9,
            pages_count: 1,
            page: 1,
            on_page: 10,
            alphabet_index: [
              {
                letter: "D",
                index: 0,
              },
              {
                letter: "E",
                index: 1,
              },
              {
                letter: "G",
                index: 2,
              },
              {
                letter: "J",
                index: 3,
              },
              {
                letter: "M",
                index: 4,
              },
              {
                letter: "P",
                index: 5,
              },
              {
                letter: "R",
                index: 6,
              },
              {
                letter: "S",
                index: 7,
              },
              {
                letter: "Y",
                index: 8,
              },
            ],
          },
        })
      );
    } else {
      res.writeHead(401);
      res.end();
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
