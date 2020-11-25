json.cashTransaction do
    json.amount @transaction.amount
    json.createdAt @transaction.created_at
end