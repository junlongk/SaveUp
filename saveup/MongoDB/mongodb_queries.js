db.transactions.find()

db.transactions.findOne(
    { transactionId: "fd12d477-f346-4faa-8efc-fb1a7d8ee02f" },
    { _id: 0, userId: 1 }
)

// get a summary of accounts with balance based on transactions
db.transactions.aggregate([
    {
        $match: {
            userId: "f31d04a4-b101-45df-ad14-e746f527d3b7"
        }
    },
    {
        $group: {
            _id: "$accountId",
            totalAmount: {
                $sum: {
                    $subtract: [
                        { $toDouble: "$inflow" },
                        { $toDouble: "$outflow" }
                    ]
                }
            }
        }
    }
])

// update account name of all matching transactions
db.transactions.updateMany(
  {
    accountId: "b30eed2c-bfa6-4192-ae6c-122586efe8eb"
  },
  {
    $set: {
      accountName: "DBS"
    }
  }
)
