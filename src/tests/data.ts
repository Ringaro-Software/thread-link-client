export const generateThread = () => {
    return {
        "actors": [
            {
                "externalId": "1",
                "providers": [
                    {
                        "providerSlug": "ses",
                        "identifier": "account1@test.com",
                        "providerSpecificData": {
                            "something": "something"
                        }
                    }
                ]
            },
            {
                "externalId": "2",
                "providers": [
                    {
                        "providerSlug": "ses",
                        "identifier": "account2@test.com",
                        "providerSpecificData": {
                            "something": "something"
                        }
                    }
                ]
            },
            {
                "providers": [
                    {
                        "externalId": "anExternalId",
                        "providerSlug": "ses",
                        "identifier": "customer@test.com",
                        "providerSpecificData": {}
                    },
                    {
                        "externalId": "anExternalIdWU",
                        "providerSlug": "whatsup",
                        "identifier": "customer",
                        "providerSpecificData": {}
                    }
                ]
            }
        ],
        "messages": [],
        "subject": "Hello"
    }
};