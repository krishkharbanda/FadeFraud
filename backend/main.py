from flask import Flask
from flask_cors import CORS
from plaid_fig.auth import auth_bp
from plaid_fig.transactions import transactions_bp
from plaid_fig.webhooks import webhooks_bp
from routes.transactions import user_transactions_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(transactions_bp)
app.register_blueprint(webhooks_bp)
app.register_blueprint(user_transactions_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
