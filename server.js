import { serveTls } from "https://deno.land/std@0.147.0/http/server.ts";

const options = {
  //hostname: "localhost",
  hostname: "[::]",
  port: 443,
  certFile: "./server.crt",
  keyFile: "./server.key",
};

serveTls(async (req, connInfo) => {
  //console.log(req.url);
  if (req.url.endsWith("/api/ipaddress")) {
    //console.log(connInfo);
    return new Response(connInfo.remoteAddr.hostname);
  }
  const body = new TextEncoder().encode(await Deno.readTextFile("index.html"));
  return new Response(body);
}, options);
