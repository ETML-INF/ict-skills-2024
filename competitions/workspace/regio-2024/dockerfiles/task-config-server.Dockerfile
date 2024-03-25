FROM node:20.11.1-alpine3.19

# --- task-config-api --- #
RUN npm install -g @skills17/task-config-api
EXPOSE 4500

CMD ["/usr/local/lib/node_modules/@skills17/task-config-api/bin/task-config-api", "/work/htmlcss", "--bind", "0.0.0.0"]
