# DC-Over-DNS API
This application is a simple API for [dc-over-dns](https://gitlab.com/jacobhaap/dc-over-dns), accepting a domain in a `GET` request, and returning JSON data in the response based on **dc-over-dns**'s `dcDNS.jsonResolve` function. In `index.js`, a Cross-Origin Resource Sharing (CORS) policy allowing any origin, and allowing preflight requests is used. A simple rate limit system based on `express-rate-limit` limits requests per client based on IP to no more than 5 requests per second. Lastly, an endpoint is opened, `/:name`, which accepts the domain to be passed to `requestHandler.js`. In the request handler, the `name` from the request is split by fullstops to isolate the top-level domain (TLD) and then check that it is valid by checking against a list of TLDs (`tlds-alpha-by-domain.txt`) [provided by IANA](https://data.iana.org/TLD/tlds-alpha-by-domain.txt). If the domain is valid, the `dcDNS` function using `jsonResolve` from the `dc-over-dns` package is used with the default resolver, and the result or any error message is returned in the request response along with an appropriate status code.

### Built With
| Package | Version | License | Purpose/Note |
|--|--|--|--|
| dc-over-dns | 1.2.2 | MIT License | Basis for the request handler/API as a whole. |
| cors | 2.8.5 | MIT License | Manages Cross-Origin Resource Sharing. |
| dotenv | 16.4.5 | BSD-2-Clause | Loads environment variables from .env files. |
| express | 4.19.1 | MIT License | Framework for handling server requests. |
| express-rate-limit | 7.2.0 | MIT License | Request limiting for public API. |
