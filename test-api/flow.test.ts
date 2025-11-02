describe("Gateway", () => {
  describe("GET /test", () => {
    it("gest 200 on success", async () => {
      await $fetch("/test", {
        baseURL: "http://localhost:3000",
        ignoreResponseError: true,
        headers: { Accept: "application/json" },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200);
          expect(response._data).toMatchObject({
            success: true,
          });
        },
      });
    });
  });

  describe("GET /test-authorization", () => {
    it("gets 404 on empty access token", async () => {
      await $fetch("/test-authorization", {
        baseURL: "http://localhost:3000",
        ignoreResponseError: true,
        headers: { Accept: "application/json" },
        onResponse: ({ response }) => {
          expect(response.status).toBe(404);
          expect(response._data).toMatchObject({
            message: "Access token not found",
          });
        },
      });
    });

    it("gets 401 on invalid access token", async () => {
      await $fetch("/test-authorization", {
        baseURL: "http://localhost:3000",
        ignoreResponseError: true,
        headers: {
          Accept: "application/json",
          Cookie: "accessToken=blahblah;",
        },
        onResponse: ({ response }) => {
          expect(response.status).toBe(401);
          expect(response._data).toMatchObject({
            message: "Invalid access token",
          });
        },
      });
    });

    it("gets 200 valid response", async () => {
      const secret = String(process.env.NITRO_SECRET);
      const accessToken = await issueAccessToken({ id: 123 }, { secret });
      await $fetch("/test-authorization", {
        baseURL: "http://localhost:3000",
        headers: {
          Accept: "application/json",
          Cookie: `accessToken=${accessToken};`,
        },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200);
          expect(response._data).toMatchObject({
            success: true,
          });
        },
      });
    });
  });

  describe("JWT Headers Forwarding", () => {
    it("forwards JWT payload in headers", async () => {
      const secret = String(process.env.NITRO_SECRET);
      const userPayload = {
        id: 456,
        email: "test@example.com",
        name: "Test User",
        roles: ["admin", "editor"],
        sub: "user-456",
      };
      const accessToken = await issueAccessToken(userPayload, { secret });

      await $fetch("/test-headers", {
        baseURL: "http://localhost:3000",
        headers: {
          Accept: "application/json",
          Cookie: `accessToken=${accessToken};`,
        },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200);
          expect(response._data).toMatchObject({
            success: true,
            headers: {
              "x-user-id": "456",
              "x-user-email": "test@example.com",
              "x-user-name": "Test User",
              "x-user-roles": "admin,editor",
              "x-user-subject": "user-456",
            },
          });
          // Check that token expiration time is also passed
          expect(response._data.headers["x-token-expires"]).toBeDefined();
        },
      });
    });

    it("handles single role as string", async () => {
      const secret = String(process.env.NITRO_SECRET);
      const userPayload = {
        id: 789,
        email: "admin@example.com",
        roles: "admin", // string instead of array
        name: "Admin User",
      };
      const accessToken = await issueAccessToken(userPayload, { secret });

      await $fetch("/test-headers", {
        baseURL: "http://localhost:3000",
        headers: {
          Accept: "application/json",
          Cookie: `accessToken=${accessToken};`,
        },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200);
          expect(response._data.headers["x-user-roles"]).toBe("admin");
          expect(response._data.headers["x-user-id"]).toBe("789");
        },
      });
    });

    it("works without optional fields", async () => {
      const secret = String(process.env.NITRO_SECRET);
      const minimalPayload = {
        id: 999,
        // no email, name, roles, sub
      };
      const accessToken = await issueAccessToken(minimalPayload, { secret });

      await $fetch("/test-headers", {
        baseURL: "http://localhost:3000",
        headers: {
          Accept: "application/json",
          Cookie: `accessToken=${accessToken};`,
        },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200);
          expect(response._data.headers["x-user-id"]).toBe("999");
          // Check that missing fields are not added to headers
          expect(response._data.headers["x-user-email"]).toBeUndefined();
          expect(response._data.headers["x-user-name"]).toBeUndefined();
          expect(response._data.headers["x-user-roles"]).toBeUndefined();
        },
      });
    });
  });

  describe("Rate Limiting", () => {
    describe("GET /test-rate-limit", () => {
      it("allows requests within limit", async () => {
        const uniqueIP = "192.168.1.210";
        // Make 3 requests (limit = 3 requests per 10 seconds)
        for (let i = 0; i < 3; i++) {
          await $fetch("/test-rate-limit", {
            baseURL: "http://localhost:3000",
            ignoreResponseError: true,
            headers: {
              Accept: "application/json",
              "X-Forwarded-For": uniqueIP,
            },
            onResponse: ({ response }) => {
              expect(response.status).toBe(200);
              expect(response._data).toMatchObject({
                success: true,
              });
            },
          });
        }
      });

      it("blocks requests after exceeding limit", async () => {
        const uniqueIP = "192.168.1.220";
        // Make 3 allowed requests
        for (let i = 0; i < 3; i++) {
          await $fetch("/test-rate-limit", {
            baseURL: "http://localhost:3000",
            ignoreResponseError: true,
            headers: {
              Accept: "application/json",
              "X-Forwarded-For": uniqueIP,
            },
          });
        }

        // 4th request should be blocked
        await $fetch("/test-rate-limit", {
          baseURL: "http://localhost:3000",
          ignoreResponseError: true,
          headers: {
            Accept: "application/json",
            "X-Forwarded-For": uniqueIP,
          },
          onResponse: ({ response }) => {
            expect(response.status).toBe(429);
            expect(response._data).toMatchObject({
              message: "Rate limit exceeded",
            });
          },
        });
      });

      it("resets limit after window expires", async () => {
        // Use unique IP for this test
        const uniqueIP = "192.168.1.200";

        // First request should pass
        await $fetch("/test-rate-limit-strict", {
          baseURL: "http://localhost:3000",
          ignoreResponseError: true,
          headers: {
            Accept: "application/json",
            "X-Forwarded-For": uniqueIP,
          },
          onResponse: ({ response }) => {
            expect(response.status).toBe(200);
          },
        });

        // Second request immediately should be blocked
        await $fetch("/test-rate-limit-strict", {
          baseURL: "http://localhost:3000",
          ignoreResponseError: true,
          headers: {
            Accept: "application/json",
            "X-Forwarded-For": uniqueIP,
          },
          onResponse: ({ response }) => {
            expect(response.status).toBe(429);
          },
        });

        // Wait 6 seconds (more than window = 5 seconds)
        await new Promise((resolve) => setTimeout(resolve, 6000));

        // Now request should pass
        await $fetch("/test-rate-limit-strict", {
          baseURL: "http://localhost:3000",
          ignoreResponseError: true,
          headers: {
            Accept: "application/json",
            "X-Forwarded-For": uniqueIP,
          },
          onResponse: ({ response }) => {
            expect(response.status).toBe(200);
            expect(response._data).toMatchObject({
              success: true,
            });
          },
        });
      }, 10000); // increase test timeout to 10 seconds

      it("tracks different IPs separately", async () => {
        // This test is harder to implement in the current environment,
        // since all requests come from the same IP.
        // In a real environment, different proxies could be used
        // or different IPs simulated through X-Forwarded-For headers

        // For demonstration, show that X-Forwarded-For header is considered
        await $fetch("/test-rate-limit-strict", {
          baseURL: "http://localhost:3000",
          ignoreResponseError: true,
          headers: {
            Accept: "application/json",
            "X-Forwarded-For": "192.168.1.100",
          },
          onResponse: ({ response }) => {
            expect(response.status).toBe(200);
          },
        });

        // Second request with the same IP should be blocked
        await $fetch("/test-rate-limit-strict", {
          baseURL: "http://localhost:3000",
          ignoreResponseError: true,
          headers: {
            Accept: "application/json",
            "X-Forwarded-For": "192.168.1.100",
          },
          onResponse: ({ response }) => {
            expect(response.status).toBe(429);
          },
        });

        // But request from different IP should pass
        await $fetch("/test-rate-limit-strict", {
          baseURL: "http://localhost:3000",
          ignoreResponseError: true,
          headers: {
            Accept: "application/json",
            "X-Forwarded-For": "192.168.1.101",
          },
          onResponse: ({ response }) => {
            expect(response.status).toBe(200);
          },
        });
      });
    });
  });
});
