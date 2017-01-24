export default {
    getOrderColumns () {
        return [
            { key: 'OrderId',         label: 'Order Id' },
            { key: 'Amount',          label: 'Amount' },
            { key: 'BuySell',         label: 'BuySell' },
            { key: 'CurrentPrice',    label: 'CurrentPrice' },
            { key: 'MarketPrice',     label: 'MarketPrice' },
            { key: 'DistanceToMarket',label: 'DistanceToMarket' },
            { key: 'AssetType',       label: 'AssetType' },
            { key: 'AccountId',       label: 'AccountId' },
            { key: 'OrderDuration',   label: 'OrderDuration' },
            { key: 'OpenOrderType',   label: 'OpenOrderType' },
            { key: 'OrderTime',       label: 'OrderTime' },
            { key: 'Status',          label: 'Status' },
            { key: 'Uic',             label: 'Uic' }
        ]
    },

    getPositionColumns () {
        return [
            { key: 'Symbol',    label: 'Symbol' },
            { key: 'Currency',  label: 'Currency' },
            { key: 'Amount',    label: 'Amount' },
            { key: 'OpenPrice', label: 'OpenPrice' },
            { key: 'CurrentPrice',      label: 'CurrentPrice' },
            { key: 'ProfitLossOnTrade', label: 'ProfitLossOnTrade' },
            { key: 'ProfitLossOnTradeInBaseCurrency', label: 'ProfitLossOnTradeInBaseCurrency' },
            { key: 'TradeCostsTotal', label: 'TradeCostsTotal' },
            { key: 'TradeCostsTotalInBaseCurrency', label: 'TradeCostsTotalInBaseCurrency' },
            { key: 'Exposure',  label: 'Exposure' },
            { key: 'ExposureInBaseCurrency', label: 'ExposureInBaseCurrency' },
            { key: 'SpotDate',  label: 'SpotDate' },
            { key: 'Status',    label: 'Status' },
            { key: 'ValueDate', label: 'ValueDate' },
            { key: 'NetPositionId', label: 'NetPositionId' },
            { key: 'AccountId', label: 'AccountId' },
            { key: 'AssetType', label: 'AssetType' },
            { key: 'ClientId',  label: 'ClientId' }
        ]
    },

    getOrderData (responseData) {
        return {
            OrderId: responseData.OrderId,
            Amount: responseData.Amount,
            BuySell: responseData.BuySell,
            CurrentPrice: responseData.CurrentPrice,
            MarketPrice: responseData.MarketPrice,
            DistanceToMarket: responseData.DistanceToMarket,
            AssetType: responseData.AssetType,
            AccountId: responseData.AccountId,
            OrderDuration: responseData.Duration.DurationType,
            OpenOrderType: responseData.OpenOrderType,
            OrderTime: responseData.OrderTime,
            Status: responseData.Status,
            Uic: responseData.Uic
        }
  },

  getPositionsData (responseData) {
        return {
            PositionId:responseData.PositionId,
            Symbol:responseData.DisplayAndFormat.Symbol,
            Currency:responseData.DisplayAndFormat.Currency,
            Amount:responseData.PositionBase.Amount,
            OpenPrice:responseData.PositionBase.OpenPrice,
            CurrentPrice: responseData.PositionView? responseData.PositionView.CurrentPrice:"",
            ProfitLossOnTrade:responseData.PositionView ?responseData.PositionView.ProfitLossOnTrade:"",
            ProfitLossOnTradeInBaseCurrency: responseData.PositionView? responseData.PositionView.ProfitLossOnTradeInBaseCurrency:"",
            TradeCostsTotal:  responseData.PositionView ?responseData.PositionView.TradeCostsTotal:"",
            TradeCostsTotalInBaseCurrency:responseData.PositionView ?responseData.PositionView.TradeCostsTotalInBaseCurrency:"",
            Exposure:responseData.PositionView?responseData.PositionView.Exposure:"",
            ExposureInBaseCurrency:responseData.PositionView?responseData.PositionView.ExposureInBaseCurrency:"",
            SpotDate:responseData.PositionBase.SpotDate,
            Status:responseData.PositionBase.Status,
            ValueDate:responseData.PositionBase.ValueDate,
            NetPositionId:responseData.NetPositionId,
            AccountId:responseData.PositionBase.AccountId,
            AssetType:responseData.PositionBase.AssetType,
            ClientId:responseData.PositionBase.ClientId
        }
    }
}
