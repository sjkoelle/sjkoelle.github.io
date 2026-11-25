import os


def handler(event, context):
    """Authorize the owner using claims verified by API Gateway."""
    claims = (
        event.get("requestContext", {})
        .get("authorizer", {})
        .get("jwt", {})
        .get("claims", {})
    )
    if not claims:
        return {"statusCode": 401}

    owner_email = os.environ["OWNER_EMAIL"]
    email_verified = str(claims.get("email_verified", "")).lower() == "true"
    if not email_verified or claims.get("email") != owner_email or claims.get("sub") != os.environ["OWNER_GOOGLE_SUB"]:
        return {"statusCode": 403}

    if event.get("routeKey") == "GET /duplex/status":
        return {
            "statusCode": 200,
            "headers": {"content-type": "application/json", "cache-control": "no-store"},
            "body": '{"state":"unconfigured"}',
        }

    return {"statusCode": 204}
