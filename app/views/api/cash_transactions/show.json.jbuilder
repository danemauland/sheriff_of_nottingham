json.cashTransaction do
    json.id @transaction.id
    json.amount @transaction.amount
    json.createdAt @transaction.created_at
end