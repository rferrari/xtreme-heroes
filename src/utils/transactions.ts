export const fetchUserPurchasedVIPTicket = async (username: string): Promise<any> => {
    const url = `https://api.hive.blog`;
    const data = JSON.stringify({
      jsonrpc: "2.0",
      method: "account_history_api.get_account_history",
      params: [
        username,           //
        1000,               // last 1000 in the results
        1000,               // limit 1000
        848647637693366652, // clear bits
        2,                  // only operations
      ],
      id: 1,
    });
  
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    };
  
    try {
        const response = await fetch(url, options);
        const responseJSON = await response.json();
        const operations = responseJSON.result.history;
        const matchFound = operations.some((operation: any) => {
          if (operation[1] && operation[1].op && operation[1].op.type === "transfer_operation") {
            const memo = operation[1].op.value.memo;    
            const to = operation[1].op.value.to;        
            const amount = parseFloat(operation[1].op.value.amount.amount)
                                    / Math.pow(10, operation[1].op.value.amount.precision);
        
            if (memo.includes(`#${import.meta.env.VITE_PURCHASE_VIP_MEMO}`) 
                && amount === parseFloat(import.meta.env.VITE_PURCHASE_VIP_PRICE)
                && to === import.meta.env.VITE_PURCHASE_VIP_TO) {
              return true;
            }
          }
        });
        
        if (matchFound) {
          return true;
        } else {
          return false; // or throw an error, depending on your use case
        }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
