wrk.method = "GET"
paths = { "/api", "/api/groups", "/" }

request = function()
  return wrk.format(nil, paths[math.random(#paths)])
end
