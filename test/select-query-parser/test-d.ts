import { PostgrestClient } from '../../src/index'
import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'

const REST_URL = 'http://localhost:3000'

// Test case https://github.com/supabase/postgrest-js/issues/523#issuecomment-2446109336
{
  type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

  type Database = {
    amazon: {
      Tables: {
        awdInventoryLedger: {
          Row: {
            archived: boolean
            asin: string
            country: string
            created: string
            date: string
            departedCartons: number
            endingWarehouseBalance: number
            fnsku: string
            foundCartons: number
            id: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            lostCartons: number
            msku: string
            otherCartons: number
            purchaseOrderId: string
            receivedCartons: number
            seller: string
            spapiRegion: Database['spapi']['Enums']['region_enum']
            startingWarehouseBalance: number
            unitsPerCarton: number
            unknownCartons: number
          }
          Insert: {
            archived?: boolean
            asin: string
            country: string
            created?: string
            date: string
            departedCartons: number
            endingWarehouseBalance: number
            fnsku: string
            foundCartons: number
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            lostCartons: number
            msku: string
            otherCartons: number
            purchaseOrderId: string
            receivedCartons: number
            seller: string
            spapiRegion: Database['spapi']['Enums']['region_enum']
            startingWarehouseBalance: number
            unitsPerCarton: number
            unknownCartons: number
          }
          Update: {
            archived?: boolean
            asin?: string
            country?: string
            created?: string
            date?: string
            departedCartons?: number
            endingWarehouseBalance?: number
            fnsku?: string
            foundCartons?: number
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            lostCartons?: number
            msku?: string
            otherCartons?: number
            purchaseOrderId?: string
            receivedCartons?: number
            seller?: string
            spapiRegion?: Database['spapi']['Enums']['region_enum']
            startingWarehouseBalance?: number
            unitsPerCarton?: number
            unknownCartons?: number
          }
          Relationships: []
        }
      }
      Views: {
        awdInventoryLedgerWithSku: {
          Row: {
            archived: boolean | null
            asin: string | null
            country: string | null
            created: string | null
            date: string | null
            departedCartons: number | null
            endingWarehouseBalance: number | null
            fnsku: string | null
            id: number | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            msku: string | null
            purchaseOrderId: string | null
            receivedCartons: number | null
            seller: string | null
            sku: string | null
            spapiRegion: Database['spapi']['Enums']['region_enum'] | null
            startingWarehouseBalance: number | null
            unitsPerCarton: number | null
          }
          Relationships: []
        }
        dailyCogs: {
          Row: {
            averageLandedCost: number | null
            cogs: number | null
            currency: Database['public']['Enums']['currency_code_enum'] | null
            date: string | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            marketplace: Database['public']['Enums']['country_code_enum'] | null
            quantity: number | null
            salesChannel: string | null
            sku: string | null
          }
          Relationships: []
        }
      }
      Functions: {
        [_ in never]: never
      }
      Enums: {
        [_ in never]: never
      }
      CompositeTypes: {
        [_ in never]: never
      }
    }
    graphql_public: {
      Tables: {
        [_ in never]: never
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        graphql: {
          Args: {
            operationName?: string
            query?: string
            variables?: Json
            extensions?: Json
          }
          Returns: Json
        }
      }
      Enums: {
        [_ in never]: never
      }
      CompositeTypes: {
        [_ in never]: never
      }
    }
    public: {
      Tables: {
        amazonAwdShipmentItems: {
          Row: {
            archived: boolean
            awdShipmentCode: string
            boxQty: number
            created: string
            id: number
            sku: string
            unitsPerBox: number
          }
          Insert: {
            archived?: boolean
            awdShipmentCode: string
            boxQty: number
            created?: string
            id?: number
            sku: string
            unitsPerBox: number
          }
          Update: {
            archived?: boolean
            awdShipmentCode?: string
            boxQty?: number
            created?: string
            id?: number
            sku?: string
            unitsPerBox?: number
          }
          Relationships: [
            {
              foreignKeyName: 'amazonAwdShipmentItems_awdShipmentCode_fkey'
              columns: ['awdShipmentCode']
              isOneToOne: false
              referencedRelation: 'awdShipments'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'amazonAwdShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'amazonAwdShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'amazonAwdShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'amazonAwdShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            }
          ]
        }
        amazonFbaInventoryLedger: {
          Row: {
            archived: boolean
            asin: string
            created: string
            customerReturns: number
            customerShipments: number
            damaged: number
            date: string
            disposed: number
            disposition: string
            endingWarehouseBalance: number
            fnsku: string
            found: number
            id: number
            inTransitBetweenWarehouses: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            location: string
            lost: number
            msku: string
            otherEvents: number
            receipts: number
            seller: string
            spapiRegion: Database['spapi']['Enums']['region_enum']
            startingWarehouseBalance: number
            title: string
            unknownEvents: number
            vendorReturns: number
            warehouseTransferInOut: number
          }
          Insert: {
            archived?: boolean
            asin: string
            created?: string
            customerReturns: number
            customerShipments: number
            damaged: number
            date: string
            disposed: number
            disposition: string
            endingWarehouseBalance: number
            fnsku: string
            found: number
            id?: number
            inTransitBetweenWarehouses: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            location: string
            lost: number
            msku: string
            otherEvents: number
            receipts: number
            seller: string
            spapiRegion: Database['spapi']['Enums']['region_enum']
            startingWarehouseBalance: number
            title: string
            unknownEvents: number
            vendorReturns: number
            warehouseTransferInOut: number
          }
          Update: {
            archived?: boolean
            asin?: string
            created?: string
            customerReturns?: number
            customerShipments?: number
            damaged?: number
            date?: string
            disposed?: number
            disposition?: string
            endingWarehouseBalance?: number
            fnsku?: string
            found?: number
            id?: number
            inTransitBetweenWarehouses?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            location?: string
            lost?: number
            msku?: string
            otherEvents?: number
            receipts?: number
            seller?: string
            spapiRegion?: Database['spapi']['Enums']['region_enum']
            startingWarehouseBalance?: number
            title?: string
            unknownEvents?: number
            vendorReturns?: number
            warehouseTransferInOut?: number
          }
          Relationships: [
            {
              foreignKeyName: 'fbaInventoryLedger_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        amazonFbaRemovalOrders: {
          Row: {
            archived: boolean
            cancelledQuantity: number | null
            created: string
            currency: string | null
            disposedQuantity: number | null
            disposition: string | null
            fnsku: string | null
            id: number
            inProcessQuantity: number | null
            lastUpdatedDate: string | null
            orderId: string
            orderSource: string | null
            orderStatus: string | null
            orderType: string | null
            region: Database['spapi']['Enums']['region_enum']
            removalFee: number | null
            requestDate: string
            requestedQuantity: number | null
            seller: string
            serviceSpeed: string | null
            shippedQuantity: number | null
            sku: string | null
          }
          Insert: {
            archived?: boolean
            cancelledQuantity?: number | null
            created?: string
            currency?: string | null
            disposedQuantity?: number | null
            disposition?: string | null
            fnsku?: string | null
            id?: number
            inProcessQuantity?: number | null
            lastUpdatedDate?: string | null
            orderId: string
            orderSource?: string | null
            orderStatus?: string | null
            orderType?: string | null
            region: Database['spapi']['Enums']['region_enum']
            removalFee?: number | null
            requestDate: string
            requestedQuantity?: number | null
            seller: string
            serviceSpeed?: string | null
            shippedQuantity?: number | null
            sku?: string | null
          }
          Update: {
            archived?: boolean
            cancelledQuantity?: number | null
            created?: string
            currency?: string | null
            disposedQuantity?: number | null
            disposition?: string | null
            fnsku?: string | null
            id?: number
            inProcessQuantity?: number | null
            lastUpdatedDate?: string | null
            orderId?: string
            orderSource?: string | null
            orderStatus?: string | null
            orderType?: string | null
            region?: Database['spapi']['Enums']['region_enum']
            removalFee?: number | null
            requestDate?: string
            requestedQuantity?: number | null
            seller?: string
            serviceSpeed?: string | null
            shippedQuantity?: number | null
            sku?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'amazonFbaRemovalOrders_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        amazonFbaShipmentItems: {
          Row: {
            archived: boolean
            created: string
            fulfillmentNetworkSku: string | null
            id: number
            prepDetailsList: Json | null
            quantityInCase: number | null
            quantityReceived: number | null
            quantityShipped: number
            releaseDate: string | null
            sellerSku: string
            shipmentId: string
            sku: string
          }
          Insert: {
            archived?: boolean
            created?: string
            fulfillmentNetworkSku?: string | null
            id?: number
            prepDetailsList?: Json | null
            quantityInCase?: number | null
            quantityReceived?: number | null
            quantityShipped: number
            releaseDate?: string | null
            sellerSku: string
            shipmentId: string
            sku: string
          }
          Update: {
            archived?: boolean
            created?: string
            fulfillmentNetworkSku?: string | null
            id?: number
            prepDetailsList?: Json | null
            quantityInCase?: number | null
            quantityReceived?: number | null
            quantityShipped?: number
            releaseDate?: string | null
            sellerSku?: string
            shipmentId?: string
            sku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'amazonFbaShipmentItems_shipmentId_fkey'
              columns: ['shipmentId']
              isOneToOne: false
              referencedRelation: 'fbaShipments'
              referencedColumns: ['amazonShipmentId']
            },
            {
              foreignKeyName: 'amazonFbaShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'amazonFbaShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'amazonFbaShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'amazonFbaShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            }
          ]
        }
        amazonOrderItems: {
          Row: {
            amazonOrderId: string
            amazonOrderItemCode: string
            archived: boolean
            asin: string
            created: string
            currency: string | null
            giftWrapPrice: number | null
            giftWrapTax: number | null
            id: number
            itemPrice: number | null
            itemStatus: string | null
            itemTax: number | null
            priceDesignation: string | null
            productName: string | null
            promotionIds: string[] | null
            quantity: number
            seller: string
            shippingPrice: number | null
            shippingTax: number | null
            shipPromotionDiscount: number | null
            signatureConfirmationRecommended: boolean | null
            sku: string
          }
          Insert: {
            amazonOrderId: string
            amazonOrderItemCode: string
            archived?: boolean
            asin: string
            created?: string
            currency?: string | null
            giftWrapPrice?: number | null
            giftWrapTax?: number | null
            id?: number
            itemPrice?: number | null
            itemStatus?: string | null
            itemTax?: number | null
            priceDesignation?: string | null
            productName?: string | null
            promotionIds?: string[] | null
            quantity: number
            seller: string
            shippingPrice?: number | null
            shippingTax?: number | null
            shipPromotionDiscount?: number | null
            signatureConfirmationRecommended?: boolean | null
            sku: string
          }
          Update: {
            amazonOrderId?: string
            amazonOrderItemCode?: string
            archived?: boolean
            asin?: string
            created?: string
            currency?: string | null
            giftWrapPrice?: number | null
            giftWrapTax?: number | null
            id?: number
            itemPrice?: number | null
            itemStatus?: string | null
            itemTax?: number | null
            priceDesignation?: string | null
            productName?: string | null
            promotionIds?: string[] | null
            quantity?: number
            seller?: string
            shippingPrice?: number | null
            shippingTax?: number | null
            shipPromotionDiscount?: number | null
            signatureConfirmationRecommended?: boolean | null
            sku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'orderItems_seller_amazonOrderId_fkey'
              columns: ['seller', 'amazonOrderId']
              isOneToOne: false
              referencedRelation: 'amazonOrders'
              referencedColumns: ['seller', 'amazonOrderId']
            },
            {
              foreignKeyName: 'orderItems_seller_amazonOrderId_fkey'
              columns: ['seller', 'amazonOrderId']
              isOneToOne: false
              referencedRelation: 'amazonOrdersWithoutRemovals'
              referencedColumns: ['seller', 'amazonOrderId']
            }
          ]
        }
        amazonOrders: {
          Row: {
            amazonOrderId: string
            archived: boolean
            created: string
            fulfillmentChannel: string | null
            id: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            isBusinessOrder: boolean | null
            isIba: boolean | null
            lastUpdatedDate: string
            localPurchaseDate: string
            marketplace: Database['public']['Enums']['country_code_enum'] | null
            merchantOrderId: string | null
            orderStatus: string
            purchaseDate: string
            purchaseOrderNumber: string | null
            region: Database['spapi']['Enums']['region_enum']
            salesChannel: string | null
            seller: string
            shipCity: string | null
            shipCountry: string | null
            shipPostalCode: string | null
            shipPromotionDiscount: number | null
            shipServiceLevel: string | null
            shipState: string | null
          }
          Insert: {
            amazonOrderId: string
            archived?: boolean
            created?: string
            fulfillmentChannel?: string | null
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            isBusinessOrder?: boolean | null
            isIba?: boolean | null
            lastUpdatedDate: string
            localPurchaseDate?: string
            marketplace?: Database['public']['Enums']['country_code_enum'] | null
            merchantOrderId?: string | null
            orderStatus: string
            purchaseDate: string
            purchaseOrderNumber?: string | null
            region: Database['spapi']['Enums']['region_enum']
            salesChannel?: string | null
            seller: string
            shipCity?: string | null
            shipCountry?: string | null
            shipPostalCode?: string | null
            shipPromotionDiscount?: number | null
            shipServiceLevel?: string | null
            shipState?: string | null
          }
          Update: {
            amazonOrderId?: string
            archived?: boolean
            created?: string
            fulfillmentChannel?: string | null
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            isBusinessOrder?: boolean | null
            isIba?: boolean | null
            lastUpdatedDate?: string
            localPurchaseDate?: string
            marketplace?: Database['public']['Enums']['country_code_enum'] | null
            merchantOrderId?: string | null
            orderStatus?: string
            purchaseDate?: string
            purchaseOrderNumber?: string | null
            region?: Database['spapi']['Enums']['region_enum']
            salesChannel?: string | null
            seller?: string
            shipCity?: string | null
            shipCountry?: string | null
            shipPostalCode?: string | null
            shipPromotionDiscount?: number | null
            shipServiceLevel?: string | null
            shipState?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'orders_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        amazonProductTypes: {
          Row: {
            archived: boolean
            created: string
            id: number
            name: string
          }
          Insert: {
            archived?: boolean
            created?: string
            id?: number
            name: string
          }
          Update: {
            archived?: boolean
            created?: string
            id?: number
            name?: string
          }
          Relationships: []
        }
        amazonProductTypesByMarketplace: {
          Row: {
            archived: boolean
            created: string
            id: number
            marketplaceId: Database['public']['Enums']['marketplace_id_enum']
            metaSchema: Json | null
            productType: string
            productTypeVersion: Json | null
            schema: Json | null
          }
          Insert: {
            archived?: boolean
            created?: string
            id?: number
            marketplaceId: Database['public']['Enums']['marketplace_id_enum']
            metaSchema?: Json | null
            productType: string
            productTypeVersion?: Json | null
            schema?: Json | null
          }
          Update: {
            archived?: boolean
            created?: string
            id?: number
            marketplaceId?: Database['public']['Enums']['marketplace_id_enum']
            metaSchema?: Json | null
            productType?: string
            productTypeVersion?: Json | null
            schema?: Json | null
          }
          Relationships: [
            {
              foreignKeyName: 'amazonProductTypesByMarketplace_productType_fkey'
              columns: ['productType']
              isOneToOne: false
              referencedRelation: 'amazonProductTypes'
              referencedColumns: ['name']
            }
          ]
        }
        amazonSearchQueryPerformanceWeekly: {
          Row: {
            archived: boolean
            ASIN: string
            'Cart Adds: 1D Shipping Speed': number
            'Cart Adds: 2D Shipping Speed': number
            'Cart Adds: ASIN Count': number
            'Cart Adds: ASIN Price (Median)': number | null
            'Cart Adds: ASIN Share %': number | null
            'Cart Adds: Cart Add Rate %': number
            'Cart Adds: Price (Median)': number | null
            'Cart Adds: Same Day Shipping Speed': number
            'Cart Adds: Total Count': number
            'Clicks: 1D Shipping Speed': number
            'Clicks: 2D Shipping Speed': number
            'Clicks: ASIN Count': number
            'Clicks: ASIN Price (Median)': number | null
            'Clicks: ASIN Share %': number | null
            'Clicks: Click Rate %': number
            'Clicks: Price (Median)': number | null
            'Clicks: Same Day Shipping Speed': number
            'Clicks: Total Count': number
            created: string
            id: number
            'Impressions: ASIN Count': number
            'Impressions: ASIN Share %': number
            'Impressions: Total Count': number
            Marketplace: Database['public']['Enums']['country_code_enum']
            'Purchases: 1D Shipping Speed': number
            'Purchases: 2D Shipping Speed': number
            'Purchases: ASIN Count': number
            'Purchases: ASIN Price (Median)': number | null
            'Purchases: ASIN Share %': number | null
            'Purchases: Price (Median)': number | null
            'Purchases: Purchase Rate %': number
            'Purchases: Same Day Shipping Speed': number
            'Purchases: Total Count': number
            'Reporting Date': string
            'Search Query': string
            'Search Query Score': number
            'Search Query Volume': number
            Seller: string
          }
          Insert: {
            archived?: boolean
            ASIN: string
            'Cart Adds: 1D Shipping Speed': number
            'Cart Adds: 2D Shipping Speed': number
            'Cart Adds: ASIN Count': number
            'Cart Adds: ASIN Price (Median)'?: number | null
            'Cart Adds: ASIN Share %'?: number | null
            'Cart Adds: Cart Add Rate %': number
            'Cart Adds: Price (Median)'?: number | null
            'Cart Adds: Same Day Shipping Speed': number
            'Cart Adds: Total Count': number
            'Clicks: 1D Shipping Speed': number
            'Clicks: 2D Shipping Speed': number
            'Clicks: ASIN Count': number
            'Clicks: ASIN Price (Median)'?: number | null
            'Clicks: ASIN Share %'?: number | null
            'Clicks: Click Rate %': number
            'Clicks: Price (Median)'?: number | null
            'Clicks: Same Day Shipping Speed': number
            'Clicks: Total Count': number
            created?: string
            id?: number
            'Impressions: ASIN Count': number
            'Impressions: ASIN Share %': number
            'Impressions: Total Count': number
            Marketplace: Database['public']['Enums']['country_code_enum']
            'Purchases: 1D Shipping Speed': number
            'Purchases: 2D Shipping Speed': number
            'Purchases: ASIN Count': number
            'Purchases: ASIN Price (Median)'?: number | null
            'Purchases: ASIN Share %'?: number | null
            'Purchases: Price (Median)'?: number | null
            'Purchases: Purchase Rate %': number
            'Purchases: Same Day Shipping Speed': number
            'Purchases: Total Count': number
            'Reporting Date': string
            'Search Query': string
            'Search Query Score': number
            'Search Query Volume': number
            Seller: string
          }
          Update: {
            archived?: boolean
            ASIN?: string
            'Cart Adds: 1D Shipping Speed'?: number
            'Cart Adds: 2D Shipping Speed'?: number
            'Cart Adds: ASIN Count'?: number
            'Cart Adds: ASIN Price (Median)'?: number | null
            'Cart Adds: ASIN Share %'?: number | null
            'Cart Adds: Cart Add Rate %'?: number
            'Cart Adds: Price (Median)'?: number | null
            'Cart Adds: Same Day Shipping Speed'?: number
            'Cart Adds: Total Count'?: number
            'Clicks: 1D Shipping Speed'?: number
            'Clicks: 2D Shipping Speed'?: number
            'Clicks: ASIN Count'?: number
            'Clicks: ASIN Price (Median)'?: number | null
            'Clicks: ASIN Share %'?: number | null
            'Clicks: Click Rate %'?: number
            'Clicks: Price (Median)'?: number | null
            'Clicks: Same Day Shipping Speed'?: number
            'Clicks: Total Count'?: number
            created?: string
            id?: number
            'Impressions: ASIN Count'?: number
            'Impressions: ASIN Share %'?: number
            'Impressions: Total Count'?: number
            Marketplace?: Database['public']['Enums']['country_code_enum']
            'Purchases: 1D Shipping Speed'?: number
            'Purchases: 2D Shipping Speed'?: number
            'Purchases: ASIN Count'?: number
            'Purchases: ASIN Price (Median)'?: number | null
            'Purchases: ASIN Share %'?: number | null
            'Purchases: Price (Median)'?: number | null
            'Purchases: Purchase Rate %'?: number
            'Purchases: Same Day Shipping Speed'?: number
            'Purchases: Total Count'?: number
            'Reporting Date'?: string
            'Search Query'?: string
            'Search Query Score'?: number
            'Search Query Volume'?: number
            Seller?: string
          }
          Relationships: [
            {
              foreignKeyName: 'amazonSearchQueryPerformanceWeekly_Seller_fkey'
              columns: ['Seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        amazonSettlementItems: {
          Row: {
            adjustmentId: string | null
            amount: number | null
            amountDescription: string | null
            amountType: string | null
            archived: boolean
            created: string
            fulfillmentId: string | null
            id: number
            localPostedDate: string | null
            localPostedDateTime: string | null
            localPostedMonth: string | null
            marketplaceName: string | null
            merchantAdjustmentItemId: string | null
            merchantOrderId: string | null
            merchantOrderItemId: string | null
            orderId: string | null
            orderItemCode: string | null
            postedDate: string | null
            postedDateTime: string | null
            promotionId: string | null
            quantityPurchased: number | null
            settlementId: number
            shipmentId: string | null
            sku: string | null
            transactionType: string | null
          }
          Insert: {
            adjustmentId?: string | null
            amount?: number | null
            amountDescription?: string | null
            amountType?: string | null
            archived?: boolean
            created?: string
            fulfillmentId?: string | null
            id?: number
            localPostedDate?: string | null
            localPostedDateTime?: string | null
            localPostedMonth?: string | null
            marketplaceName?: string | null
            merchantAdjustmentItemId?: string | null
            merchantOrderId?: string | null
            merchantOrderItemId?: string | null
            orderId?: string | null
            orderItemCode?: string | null
            postedDate?: string | null
            postedDateTime?: string | null
            promotionId?: string | null
            quantityPurchased?: number | null
            settlementId: number
            shipmentId?: string | null
            sku?: string | null
            transactionType?: string | null
          }
          Update: {
            adjustmentId?: string | null
            amount?: number | null
            amountDescription?: string | null
            amountType?: string | null
            archived?: boolean
            created?: string
            fulfillmentId?: string | null
            id?: number
            localPostedDate?: string | null
            localPostedDateTime?: string | null
            localPostedMonth?: string | null
            marketplaceName?: string | null
            merchantAdjustmentItemId?: string | null
            merchantOrderId?: string | null
            merchantOrderItemId?: string | null
            orderId?: string | null
            orderItemCode?: string | null
            postedDate?: string | null
            postedDateTime?: string | null
            promotionId?: string | null
            quantityPurchased?: number | null
            settlementId?: number
            shipmentId?: string | null
            sku?: string | null
            transactionType?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'settlementItems_settlementId_fkey'
              columns: ['settlementId']
              isOneToOne: false
              referencedRelation: 'amazonSettlements'
              referencedColumns: ['id']
            }
          ]
        }
        amazonSettlementQuickbooksMapper: {
          Row: {
            amountDescription: string
            amountType: string
            archived: boolean
            created: string
            id: number
            qbAccountName: string
            transactionType: string
          }
          Insert: {
            amountDescription: string
            amountType: string
            archived?: boolean
            created?: string
            id?: number
            qbAccountName: string
            transactionType: string
          }
          Update: {
            amountDescription?: string
            amountType?: string
            archived?: boolean
            created?: string
            id?: number
            qbAccountName?: string
            transactionType?: string
          }
          Relationships: []
        }
        amazonSettlements: {
          Row: {
            archived: boolean
            created: string
            currency: string | null
            depositDate: string | null
            expectedNumOfItems: number
            id: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            marketplace: Database['public']['Enums']['country_code_enum'] | null
            region: Database['spapi']['Enums']['region_enum']
            reportId: string | null
            seller: string
            settlementEndDate: string | null
            settlementId: string
            settlementStartDate: string | null
            status: Database['public']['Enums']['amazon_settlement_status_enum']
            timezone: string
            totalAmount: number | null
          }
          Insert: {
            archived?: boolean
            created?: string
            currency?: string | null
            depositDate?: string | null
            expectedNumOfItems: number
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            marketplace?: Database['public']['Enums']['country_code_enum'] | null
            region: Database['spapi']['Enums']['region_enum']
            reportId?: string | null
            seller: string
            settlementEndDate?: string | null
            settlementId: string
            settlementStartDate?: string | null
            status?: Database['public']['Enums']['amazon_settlement_status_enum']
            timezone?: string
            totalAmount?: number | null
          }
          Update: {
            archived?: boolean
            created?: string
            currency?: string | null
            depositDate?: string | null
            expectedNumOfItems?: number
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            marketplace?: Database['public']['Enums']['country_code_enum'] | null
            region?: Database['spapi']['Enums']['region_enum']
            reportId?: string | null
            seller?: string
            settlementEndDate?: string | null
            settlementId?: string
            settlementStartDate?: string | null
            status?: Database['public']['Enums']['amazon_settlement_status_enum']
            timezone?: string
            totalAmount?: number | null
          }
          Relationships: [
            {
              foreignKeyName: 'settlements_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        awdShipmentDocuments: {
          Row: {
            archived: boolean
            awdShipmentCode: string
            created: string
            fileIds: string[]
            id: number
            label: string
            numOfRequiredDocs: number
          }
          Insert: {
            archived?: boolean
            awdShipmentCode: string
            created?: string
            fileIds?: string[]
            id?: number
            label: string
            numOfRequiredDocs?: number
          }
          Update: {
            archived?: boolean
            awdShipmentCode?: string
            created?: string
            fileIds?: string[]
            id?: number
            label?: string
            numOfRequiredDocs?: number
          }
          Relationships: [
            {
              foreignKeyName: 'awdShipmentDocuments_awdShipmentCode_fkey'
              columns: ['awdShipmentCode']
              isOneToOne: false
              referencedRelation: 'awdShipments'
              referencedColumns: ['code']
            }
          ]
        }
        awdShipmentItems: {
          Row: {
            archived: boolean
            awdShipmentCode: string
            boxQty: number
            created: string
            id: number
            masterCartonId: number
            sku: string
          }
          Insert: {
            archived?: boolean
            awdShipmentCode: string
            boxQty: number
            created?: string
            id?: number
            masterCartonId: number
            sku: string
          }
          Update: {
            archived?: boolean
            awdShipmentCode?: string
            boxQty?: number
            created?: string
            id?: number
            masterCartonId?: number
            sku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'awdShipmentItems_awdShipmentCode_fkey'
              columns: ['awdShipmentCode']
              isOneToOne: false
              referencedRelation: 'awdShipments'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'awdShipmentItems_masterCartonId_fkey'
              columns: ['masterCartonId']
              isOneToOne: false
              referencedRelation: 'masterCartons'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'awdShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'awdShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'awdShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'awdShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            }
          ]
        }
        awdShipments: {
          Row: {
            amazonOrderId: string | null
            amazonReferenceId: string | null
            amazonShipBy: string | null
            amazonShipmentId: string | null
            amazonStatus: string | null
            amazonTrackingId: string | null
            amazonUpdatedAt: string | null
            archived: boolean
            awdCenter: string | null
            awdClosedDate: string | null
            awdReceivedDate: string | null
            code: string
            created: string
            derivedAwdClosedDate: boolean
            derivedAwdReceivedDate: boolean
            directFromSupplier: boolean
            externalReferenceId: string | null
            folderId: string | null
            fromPoShipment: string | null
            fromWarehouse: string | null
            id: number
            inventoryDate: string | null
            nthShipment: number
            receivedCases: number | null
            receivedPallets: number | null
            receivedUnits: number | null
            sellerCode: string
            toMarketplace: Database['public']['Enums']['country_code_enum']
          }
          Insert: {
            amazonOrderId?: string | null
            amazonReferenceId?: string | null
            amazonShipBy?: string | null
            amazonShipmentId?: string | null
            amazonStatus?: string | null
            amazonTrackingId?: string | null
            amazonUpdatedAt?: string | null
            archived?: boolean
            awdCenter?: string | null
            awdClosedDate?: string | null
            awdReceivedDate?: string | null
            code: string
            created?: string
            derivedAwdClosedDate?: boolean
            derivedAwdReceivedDate?: boolean
            directFromSupplier?: boolean
            externalReferenceId?: string | null
            folderId?: string | null
            fromPoShipment?: string | null
            fromWarehouse?: string | null
            id?: number
            inventoryDate?: string | null
            nthShipment: number
            receivedCases?: number | null
            receivedPallets?: number | null
            receivedUnits?: number | null
            sellerCode: string
            toMarketplace: Database['public']['Enums']['country_code_enum']
          }
          Update: {
            amazonOrderId?: string | null
            amazonReferenceId?: string | null
            amazonShipBy?: string | null
            amazonShipmentId?: string | null
            amazonStatus?: string | null
            amazonTrackingId?: string | null
            amazonUpdatedAt?: string | null
            archived?: boolean
            awdCenter?: string | null
            awdClosedDate?: string | null
            awdReceivedDate?: string | null
            code?: string
            created?: string
            derivedAwdClosedDate?: boolean
            derivedAwdReceivedDate?: boolean
            directFromSupplier?: boolean
            externalReferenceId?: string | null
            folderId?: string | null
            fromPoShipment?: string | null
            fromWarehouse?: string | null
            id?: number
            inventoryDate?: string | null
            nthShipment?: number
            receivedCases?: number | null
            receivedPallets?: number | null
            receivedUnits?: number | null
            sellerCode?: string
            toMarketplace?: Database['public']['Enums']['country_code_enum']
          }
          Relationships: [
            {
              foreignKeyName: 'awdShipments_fromPoShipment_fkey'
              columns: ['fromPoShipment']
              isOneToOne: false
              referencedRelation: 'poShipments'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'awdShipments_fromWarehouse_fkey'
              columns: ['fromWarehouse']
              isOneToOne: false
              referencedRelation: 'warehouses'
              referencedColumns: ['poShipmentCode']
            },
            {
              foreignKeyName: 'awdShipments_sellerCode_fkey'
              columns: ['sellerCode']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['amazonShipmentCode']
            }
          ]
        }
        barcodes: {
          Row: {
            archived: boolean
            brandId: number
            created: string
            gtin: string
            id: number
            provider: Database['public']['Enums']['barcode_provider_enum']
            type: Database['public']['Enums']['barcode_type_enum']
          }
          Insert: {
            archived?: boolean
            brandId: number
            created?: string
            gtin: string
            id?: number
            provider: Database['public']['Enums']['barcode_provider_enum']
            type: Database['public']['Enums']['barcode_type_enum']
          }
          Update: {
            archived?: boolean
            brandId?: number
            created?: string
            gtin?: string
            id?: number
            provider?: Database['public']['Enums']['barcode_provider_enum']
            type?: Database['public']['Enums']['barcode_type_enum']
          }
          Relationships: [
            {
              foreignKeyName: 'barcodes_brandId_fkey'
              columns: ['brandId']
              isOneToOne: false
              referencedRelation: 'brands'
              referencedColumns: ['id']
            }
          ]
        }
        baseInventoryLedger: {
          Row: {
            archived: boolean
            awdShipmentCode: string | null
            boxQty: number | null
            code: string | null
            created: string
            date: string | null
            fbaShipmentCode: string | null
            id: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            poCode: string | null
            poShipmentCode: string | null
            sku: string
            stage: Database['public']['Enums']['inventory_stage_enum'] | null
            unitQty: number
            unitsPerBox: number | null
            valueUsd: number | null
            warehouse: string | null
          }
          Insert: {
            archived?: boolean
            awdShipmentCode?: string | null
            boxQty?: number | null
            code?: string | null
            created?: string
            date?: string | null
            fbaShipmentCode?: string | null
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            poCode?: string | null
            poShipmentCode?: string | null
            sku: string
            stage?: Database['public']['Enums']['inventory_stage_enum'] | null
            unitQty: number
            unitsPerBox?: number | null
            valueUsd?: number | null
            warehouse?: string | null
          }
          Update: {
            archived?: boolean
            awdShipmentCode?: string | null
            boxQty?: number | null
            code?: string | null
            created?: string
            date?: string | null
            fbaShipmentCode?: string | null
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            poCode?: string | null
            poShipmentCode?: string | null
            sku?: string
            stage?: Database['public']['Enums']['inventory_stage_enum'] | null
            unitQty?: number
            unitsPerBox?: number | null
            valueUsd?: number | null
            warehouse?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'baseInventoryLedger_awdShipmentCode_fkey'
              columns: ['awdShipmentCode']
              isOneToOne: false
              referencedRelation: 'awdShipments'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'baseInventoryLedger_fbaShipmentCode_fkey'
              columns: ['fbaShipmentCode']
              isOneToOne: false
              referencedRelation: 'fbaShipments'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'baseInventoryLedger_poCode_fkey'
              columns: ['poCode']
              isOneToOne: false
              referencedRelation: 'purchaseOrders'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'baseInventoryLedger_poShipmentCode_fkey'
              columns: ['poShipmentCode']
              isOneToOne: false
              referencedRelation: 'poShipments'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'baseInventoryLedger_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'baseInventoryLedger_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'baseInventoryLedger_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'baseInventoryLedger_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'baseInventoryLedger_warehouse_fkey'
              columns: ['warehouse']
              isOneToOne: false
              referencedRelation: 'warehouses'
              referencedColumns: ['name']
            }
          ]
        }
        brands: {
          Row: {
            archived: boolean
            created: string
            id: number
            manufacturerContactInformation: string
            name: string
            poCode: string
            poFolderId: string | null
            seller: string
            skuCode: string
          }
          Insert: {
            archived?: boolean
            created?: string
            id?: number
            manufacturerContactInformation: string
            name: string
            poCode: string
            poFolderId?: string | null
            seller: string
            skuCode: string
          }
          Update: {
            archived?: boolean
            created?: string
            id?: number
            manufacturerContactInformation?: string
            name?: string
            poCode?: string
            poFolderId?: string | null
            seller?: string
            skuCode?: string
          }
          Relationships: [
            {
              foreignKeyName: 'brands_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        demandForecastItems: {
          Row: {
            archived: boolean
            created: string
            date: string
            demandForecastId: number
            id: number
            sku: string
            unitQty: number
          }
          Insert: {
            archived?: boolean
            created?: string
            date: string
            demandForecastId: number
            id?: number
            sku: string
            unitQty: number
          }
          Update: {
            archived?: boolean
            created?: string
            date?: string
            demandForecastId?: number
            id?: number
            sku?: string
            unitQty?: number
          }
          Relationships: [
            {
              foreignKeyName: 'demandForecastItems_demandForecastId_fkey'
              columns: ['demandForecastId']
              isOneToOne: false
              referencedRelation: 'demandForecasts'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'demandForecastItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'demandForecastItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'demandForecastItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'demandForecastItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            }
          ]
        }
        demandForecasts: {
          Row: {
            archived: boolean
            created: string
            dateOfForecast: string
            id: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            name: string
            salesChannel: Database['public']['Enums']['sales_channel_enum']
            seller: string
          }
          Insert: {
            archived?: boolean
            created?: string
            dateOfForecast: string
            id?: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            name: string
            salesChannel: Database['public']['Enums']['sales_channel_enum']
            seller: string
          }
          Update: {
            archived?: boolean
            created?: string
            dateOfForecast?: string
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum']
            name?: string
            salesChannel?: Database['public']['Enums']['sales_channel_enum']
            seller?: string
          }
          Relationships: [
            {
              foreignKeyName: 'demandForecasts_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        designs: {
          Row: {
            archived: boolean
            brandId: number
            created: string
            id: number
            name: string
            skuCode: string
            type: Database['public']['Enums']['designtype_enum']
            variationName: Json
          }
          Insert: {
            archived?: boolean
            brandId: number
            created?: string
            id?: number
            name: string
            skuCode: string
            type: Database['public']['Enums']['designtype_enum']
            variationName: Json
          }
          Update: {
            archived?: boolean
            brandId?: number
            created?: string
            id?: number
            name?: string
            skuCode?: string
            type?: Database['public']['Enums']['designtype_enum']
            variationName?: Json
          }
          Relationships: [
            {
              foreignKeyName: 'designs_brandId_fkey'
              columns: ['brandId']
              isOneToOne: false
              referencedRelation: 'brands'
              referencedColumns: ['id']
            }
          ]
        }
        fbaShipmentDocuments: {
          Row: {
            archived: boolean
            created: string
            fbaShipmentCode: string
            fileIds: string[]
            id: number
            label: string
            numOfRequiredDocs: number
          }
          Insert: {
            archived?: boolean
            created?: string
            fbaShipmentCode: string
            fileIds?: string[]
            id?: number
            label: string
            numOfRequiredDocs?: number
          }
          Update: {
            archived?: boolean
            created?: string
            fbaShipmentCode?: string
            fileIds?: string[]
            id?: number
            label?: string
            numOfRequiredDocs?: number
          }
          Relationships: [
            {
              foreignKeyName: 'fbaShipmentDocuments_fbaShipmentCode_fkey'
              columns: ['fbaShipmentCode']
              isOneToOne: false
              referencedRelation: 'fbaShipments'
              referencedColumns: ['code']
            }
          ]
        }
        fbaShipmentItems: {
          Row: {
            archived: boolean
            boxQty: number
            created: string
            fbaShipmentCode: string
            id: number
            masterCartonId: number
            sku: string
          }
          Insert: {
            archived?: boolean
            boxQty: number
            created?: string
            fbaShipmentCode: string
            id?: number
            masterCartonId: number
            sku: string
          }
          Update: {
            archived?: boolean
            boxQty?: number
            created?: string
            fbaShipmentCode?: string
            id?: number
            masterCartonId?: number
            sku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'fbaShipmentItems_fbaShipmentCode_fkey'
              columns: ['fbaShipmentCode']
              isOneToOne: false
              referencedRelation: 'fbaShipments'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'fbaShipmentItems_masterCartonId_fkey'
              columns: ['masterCartonId']
              isOneToOne: false
              referencedRelation: 'masterCartons'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'fbaShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'fbaShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'fbaShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'fbaShipmentItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            }
          ]
        }
        fbaShipments: {
          Row: {
            amazonShipmentId: string | null
            archived: boolean
            code: string
            created: string
            destinationFulfillmentCenter: string | null
            directFromSupplier: boolean | null
            fbaReceivedDate: string | null
            fbaStatus: string | null
            folderId: string | null
            fromPoShipment: string | null
            fromWarehouse: string | null
            id: number
            inventoryDate: string | null
            labelingOwner: Database['public']['Enums']['fba_shipment_owner_enum']
            name: string | null
            nthShipment: number
            numOfPallets: number | null
            prepOwner: Database['public']['Enums']['fba_shipment_owner_enum']
            sellerCode: string
            shipmentType: Database['public']['Enums']['fba_shipment_type_enum']
            toMarketplace: Database['public']['Enums']['country_code_enum']
          }
          Insert: {
            amazonShipmentId?: string | null
            archived?: boolean
            code: string
            created?: string
            destinationFulfillmentCenter?: string | null
            directFromSupplier?: boolean | null
            fbaReceivedDate?: string | null
            fbaStatus?: string | null
            folderId?: string | null
            fromPoShipment?: string | null
            fromWarehouse?: string | null
            id?: number
            inventoryDate?: string | null
            labelingOwner: Database['public']['Enums']['fba_shipment_owner_enum']
            name?: string | null
            nthShipment: number
            numOfPallets?: number | null
            prepOwner: Database['public']['Enums']['fba_shipment_owner_enum']
            sellerCode: string
            shipmentType: Database['public']['Enums']['fba_shipment_type_enum']
            toMarketplace: Database['public']['Enums']['country_code_enum']
          }
          Update: {
            amazonShipmentId?: string | null
            archived?: boolean
            code?: string
            created?: string
            destinationFulfillmentCenter?: string | null
            directFromSupplier?: boolean | null
            fbaReceivedDate?: string | null
            fbaStatus?: string | null
            folderId?: string | null
            fromPoShipment?: string | null
            fromWarehouse?: string | null
            id?: number
            inventoryDate?: string | null
            labelingOwner?: Database['public']['Enums']['fba_shipment_owner_enum']
            name?: string | null
            nthShipment?: number
            numOfPallets?: number | null
            prepOwner?: Database['public']['Enums']['fba_shipment_owner_enum']
            sellerCode?: string
            shipmentType?: Database['public']['Enums']['fba_shipment_type_enum']
            toMarketplace?: Database['public']['Enums']['country_code_enum']
          }
          Relationships: [
            {
              foreignKeyName: 'fbaShipments_fromWarehouse_fkey'
              columns: ['fromWarehouse']
              isOneToOne: false
              referencedRelation: 'warehouses'
              referencedColumns: ['poShipmentCode']
            },
            {
              foreignKeyName: 'fbaShipments_poShipmentCode_fkey'
              columns: ['fromPoShipment']
              isOneToOne: false
              referencedRelation: 'poShipments'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'fbaShipments_sellerCode_fkey'
              columns: ['sellerCode']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['amazonShipmentCode']
            }
          ]
        }
        fxRates: {
          Row: {
            archived: boolean
            baseCurrency: Database['public']['Enums']['currency_code_enum']
            created: string
            date: string
            id: number
            quoteCurrency: Database['public']['Enums']['currency_code_enum']
            rate: number
          }
          Insert: {
            archived?: boolean
            baseCurrency: Database['public']['Enums']['currency_code_enum']
            created?: string
            date: string
            id?: number
            quoteCurrency: Database['public']['Enums']['currency_code_enum']
            rate: number
          }
          Update: {
            archived?: boolean
            baseCurrency?: Database['public']['Enums']['currency_code_enum']
            created?: string
            date?: string
            id?: number
            quoteCurrency?: Database['public']['Enums']['currency_code_enum']
            rate?: number
          }
          Relationships: []
        }
        inventoryAdjustments: {
          Row: {
            archived: boolean
            boxQty: number | null
            brandCode: string
            code: string
            created: string
            date: string
            id: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            nthAdj: number
            reason: string
            sku: string
            stage: Database['public']['Enums']['inventory_stage_enum']
            unitQty: number
            unitsPerBox: number | null
            warehouse: string | null
          }
          Insert: {
            archived?: boolean
            boxQty?: number | null
            brandCode: string
            code: string
            created?: string
            date: string
            id?: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            nthAdj: number
            reason: string
            sku: string
            stage: Database['public']['Enums']['inventory_stage_enum']
            unitQty: number
            unitsPerBox?: number | null
            warehouse?: string | null
          }
          Update: {
            archived?: boolean
            boxQty?: number | null
            brandCode?: string
            code?: string
            created?: string
            date?: string
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum']
            nthAdj?: number
            reason?: string
            sku?: string
            stage?: Database['public']['Enums']['inventory_stage_enum']
            unitQty?: number
            unitsPerBox?: number | null
            warehouse?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'inventoryAdjustments_brandCode_fkey'
              columns: ['brandCode']
              isOneToOne: false
              referencedRelation: 'brands'
              referencedColumns: ['poCode']
            },
            {
              foreignKeyName: 'inventoryAdjustments_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'inventoryAdjustments_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'inventoryAdjustments_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'inventoryAdjustments_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'inventoryAdjustments_warehouse_fkey'
              columns: ['warehouse']
              isOneToOne: false
              referencedRelation: 'warehouses'
              referencedColumns: ['name']
            }
          ]
        }
        landedCostLedger: {
          Row: {
            archived: boolean
            averageLandedCost: number
            created: string
            currency: Database['public']['Enums']['currency_code_enum']
            date: string
            id: number
            incomingUnitLandedCost: number | null
            incomingUnitQty: number | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            landedUnitLandedCost: number | null
            landedUnitQty: number
            poShipmentCode: string
            rowIndex: number
            shipmentType: Database['public']['Enums']['shipmenttype_enum']
            sku: string
          }
          Insert: {
            archived?: boolean
            averageLandedCost: number
            created?: string
            currency: Database['public']['Enums']['currency_code_enum']
            date: string
            id?: number
            incomingUnitLandedCost?: number | null
            incomingUnitQty?: number | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            landedUnitLandedCost?: number | null
            landedUnitQty: number
            poShipmentCode: string
            rowIndex: number
            shipmentType: Database['public']['Enums']['shipmenttype_enum']
            sku: string
          }
          Update: {
            archived?: boolean
            averageLandedCost?: number
            created?: string
            currency?: Database['public']['Enums']['currency_code_enum']
            date?: string
            id?: number
            incomingUnitLandedCost?: number | null
            incomingUnitQty?: number | null
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum']
            landedUnitLandedCost?: number | null
            landedUnitQty?: number
            poShipmentCode?: string
            rowIndex?: number
            shipmentType?: Database['public']['Enums']['shipmenttype_enum']
            sku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'landedCostLedger_poShipmentCode_fkey'
              columns: ['poShipmentCode']
              isOneToOne: false
              referencedRelation: 'poShipments'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'landedCostLedger_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'landedCostLedger_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'landedCostLedger_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'landedCostLedger_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            }
          ]
        }
        masterCartons: {
          Row: {
            archived: boolean
            boxDimensions: number[]
            boxDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            boxWeight: number
            boxWeightUnit: Database['public']['Enums']['weight_unit_enum']
            created: string
            id: number
            name: string
            supplier: string
            unitsPerBox: number
          }
          Insert: {
            archived?: boolean
            boxDimensions: number[]
            boxDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            boxWeight: number
            boxWeightUnit: Database['public']['Enums']['weight_unit_enum']
            created?: string
            id?: number
            name: string
            supplier: string
            unitsPerBox: number
          }
          Update: {
            archived?: boolean
            boxDimensions?: number[]
            boxDimensionsUnit?: Database['public']['Enums']['length_unit_enum']
            boxWeight?: number
            boxWeightUnit?: Database['public']['Enums']['weight_unit_enum']
            created?: string
            id?: number
            name?: string
            supplier?: string
            unitsPerBox?: number
          }
          Relationships: [
            {
              foreignKeyName: 'masterCartons_supplier_fkey'
              columns: ['supplier']
              isOneToOne: false
              referencedRelation: 'suppliers'
              referencedColumns: ['name']
            }
          ]
        }
        music: {
          Row: {
            archived: boolean
            brandId: number
            created: string
            id: number
            localName: Json
            name: string
          }
          Insert: {
            archived?: boolean
            brandId: number
            created?: string
            id?: number
            localName: Json
            name: string
          }
          Update: {
            archived?: boolean
            brandId?: number
            created?: string
            id?: number
            localName?: Json
            name?: string
          }
          Relationships: [
            {
              foreignKeyName: 'music_brandId_fkey'
              columns: ['brandId']
              isOneToOne: false
              referencedRelation: 'brands'
              referencedColumns: ['id']
            }
          ]
        }
        parentProductBoxConfigurations: {
          Row: {
            archived: boolean
            boxName: string
            created: string
            id: number
            master: boolean
            parentSku: string
          }
          Insert: {
            archived?: boolean
            boxName: string
            created?: string
            id?: number
            master: boolean
            parentSku: string
          }
          Update: {
            archived?: boolean
            boxName?: string
            created?: string
            id?: number
            master?: boolean
            parentSku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'parentProductBoxConfigurations_boxName_fkey'
              columns: ['boxName']
              isOneToOne: false
              referencedRelation: 'masterCartons'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'parentProductBoxConfigurations_parentSku_fkey'
              columns: ['parentSku']
              isOneToOne: false
              referencedRelation: 'parentProducts'
              referencedColumns: ['sku']
            }
          ]
        }
        parentProductListings: {
          Row: {
            archived: boolean
            created: string
            id: number
            language: Database['public']['Enums']['lang_enum']
            marketplace: Database['public']['Enums']['country_code_enum']
            parentProductId: number
            title: string | null
          }
          Insert: {
            archived?: boolean
            created?: string
            id?: number
            language: Database['public']['Enums']['lang_enum']
            marketplace: Database['public']['Enums']['country_code_enum']
            parentProductId: number
            title?: string | null
          }
          Update: {
            archived?: boolean
            created?: string
            id?: number
            language?: Database['public']['Enums']['lang_enum']
            marketplace?: Database['public']['Enums']['country_code_enum']
            parentProductId?: number
            title?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'parentProductListings_parentProductId_fkey'
              columns: ['parentProductId']
              isOneToOne: false
              referencedRelation: 'parentProducts'
              referencedColumns: ['id']
            }
          ]
        }
        parentProducts: {
          Row: {
            amazonProductCategories: Json
            archived: boolean
            asins: Json
            breakEvenCalculationInputs:
              | Database['public']['CompositeTypes']['break_even_calculation_inputs']
              | null
            created: string
            id: number
            images: string[]
            keepChildrenDimensions: boolean
            landedCostEstimationInputs: Json | null
            landedCostEstimations: Json
            name: string
            numOfDoors: number | null
            numOfDrawers: number | null
            packageDimensions: number[]
            packageDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            packageWeight: number
            packageWeightUnit: Database['public']['Enums']['weight_unit_enum']
            productDimensions: number[]
            productDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            productLine: string
            productWeight: number
            productWeightUnit: Database['public']['Enums']['weight_unit_enum']
            reviews: Json | null
            sku: string
            skuNumericCode: number
            supplier: string
            variationTheme: Database['public']['Enums']['variation_theme_enum'] | null
          }
          Insert: {
            amazonProductCategories: Json
            archived?: boolean
            asins: Json
            breakEvenCalculationInputs?:
              | Database['public']['CompositeTypes']['break_even_calculation_inputs']
              | null
            created?: string
            id?: number
            images: string[]
            keepChildrenDimensions: boolean
            landedCostEstimationInputs?: Json | null
            landedCostEstimations: Json
            name: string
            numOfDoors?: number | null
            numOfDrawers?: number | null
            packageDimensions: number[]
            packageDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            packageWeight: number
            packageWeightUnit: Database['public']['Enums']['weight_unit_enum']
            productDimensions: number[]
            productDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            productLine: string
            productWeight: number
            productWeightUnit: Database['public']['Enums']['weight_unit_enum']
            reviews?: Json | null
            sku: string
            skuNumericCode: number
            supplier: string
            variationTheme?: Database['public']['Enums']['variation_theme_enum'] | null
          }
          Update: {
            amazonProductCategories?: Json
            archived?: boolean
            asins?: Json
            breakEvenCalculationInputs?:
              | Database['public']['CompositeTypes']['break_even_calculation_inputs']
              | null
            created?: string
            id?: number
            images?: string[]
            keepChildrenDimensions?: boolean
            landedCostEstimationInputs?: Json | null
            landedCostEstimations?: Json
            name?: string
            numOfDoors?: number | null
            numOfDrawers?: number | null
            packageDimensions?: number[]
            packageDimensionsUnit?: Database['public']['Enums']['length_unit_enum']
            packageWeight?: number
            packageWeightUnit?: Database['public']['Enums']['weight_unit_enum']
            productDimensions?: number[]
            productDimensionsUnit?: Database['public']['Enums']['length_unit_enum']
            productLine?: string
            productWeight?: number
            productWeightUnit?: Database['public']['Enums']['weight_unit_enum']
            reviews?: Json | null
            sku?: string
            skuNumericCode?: number
            supplier?: string
            variationTheme?: Database['public']['Enums']['variation_theme_enum'] | null
          }
          Relationships: [
            {
              foreignKeyName: 'fk_parentproduct_productline'
              columns: ['productLine']
              isOneToOne: false
              referencedRelation: 'productLines'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'parentProducts_supplier_fkey'
              columns: ['supplier']
              isOneToOne: false
              referencedRelation: 'suppliers'
              referencedColumns: ['name']
            }
          ]
        }
        parentProductsByMarketplace: {
          Row: {
            amazonBrowseNode: string | null
            archived: boolean
            created: string
            fbaFeeCategory: Database['public']['Enums']['fba_fee_category_enum']
            id: number
            marketplace: Database['public']['Enums']['country_code_enum']
            parentProductId: number
            targetPrice: number | null
            targetProfitMargin: number | null
            targetRoi: number | null
            vatRate: number | null
          }
          Insert: {
            amazonBrowseNode?: string | null
            archived?: boolean
            created?: string
            fbaFeeCategory?: Database['public']['Enums']['fba_fee_category_enum']
            id?: number
            marketplace: Database['public']['Enums']['country_code_enum']
            parentProductId: number
            targetPrice?: number | null
            targetProfitMargin?: number | null
            targetRoi?: number | null
            vatRate?: number | null
          }
          Update: {
            amazonBrowseNode?: string | null
            archived?: boolean
            created?: string
            fbaFeeCategory?: Database['public']['Enums']['fba_fee_category_enum']
            id?: number
            marketplace?: Database['public']['Enums']['country_code_enum']
            parentProductId?: number
            targetPrice?: number | null
            targetProfitMargin?: number | null
            targetRoi?: number | null
            vatRate?: number | null
          }
          Relationships: [
            {
              foreignKeyName: 'parentProductsByMarketplace_parentProductId_fkey'
              columns: ['parentProductId']
              isOneToOne: false
              referencedRelation: 'parentProducts'
              referencedColumns: ['id']
            }
          ]
        }
        poDocuments: {
          Row: {
            archived: boolean
            created: string
            fileIds: string[]
            id: number
            label: string
            numOfRequiredDocs: number
            poCode: string
          }
          Insert: {
            archived?: boolean
            created?: string
            fileIds?: string[]
            id?: number
            label: string
            numOfRequiredDocs?: number
            poCode: string
          }
          Update: {
            archived?: boolean
            created?: string
            fileIds?: string[]
            id?: number
            label?: string
            numOfRequiredDocs?: number
            poCode?: string
          }
          Relationships: [
            {
              foreignKeyName: 'poDocuments_poCode_fkey'
              columns: ['poCode']
              isOneToOne: false
              referencedRelation: 'purchaseOrders'
              referencedColumns: ['code']
            }
          ]
        }
        poShipmentDocuments: {
          Row: {
            archived: boolean
            created: string
            fileIds: string[]
            id: number
            label: string
            numOfRequiredDocs: number
            poShipmentCode: string
          }
          Insert: {
            archived?: boolean
            created?: string
            fileIds?: string[]
            id?: number
            label: string
            numOfRequiredDocs?: number
            poShipmentCode: string
          }
          Update: {
            archived?: boolean
            created?: string
            fileIds?: string[]
            id?: number
            label?: string
            numOfRequiredDocs?: number
            poShipmentCode?: string
          }
          Relationships: [
            {
              foreignKeyName: 'poShipmentDocuments_poShipmentCode_fkey'
              columns: ['poShipmentCode']
              isOneToOne: false
              referencedRelation: 'poShipments'
              referencedColumns: ['code']
            }
          ]
        }
        poShipmentImportCosts: {
          Row: {
            amount: number
            archived: boolean
            created: string
            currency: Database['public']['Enums']['currency_code_enum']
            description: string
            fxRate: number | null
            id: number
            poShipmentCode: string
            transactionAmount: number | null
            transactionCurrency: Database['public']['Enums']['currency_code_enum']
            transactionDate: string | null
            type: Database['public']['Enums']['import_cost_type_enum']
          }
          Insert: {
            amount: number
            archived?: boolean
            created?: string
            currency: Database['public']['Enums']['currency_code_enum']
            description: string
            fxRate?: number | null
            id?: number
            poShipmentCode: string
            transactionAmount?: number | null
            transactionCurrency: Database['public']['Enums']['currency_code_enum']
            transactionDate?: string | null
            type: Database['public']['Enums']['import_cost_type_enum']
          }
          Update: {
            amount?: number
            archived?: boolean
            created?: string
            currency?: Database['public']['Enums']['currency_code_enum']
            description?: string
            fxRate?: number | null
            id?: number
            poShipmentCode?: string
            transactionAmount?: number | null
            transactionCurrency?: Database['public']['Enums']['currency_code_enum']
            transactionDate?: string | null
            type?: Database['public']['Enums']['import_cost_type_enum']
          }
          Relationships: [
            {
              foreignKeyName: 'poShipmentImportCosts_poShipmentCode_fkey'
              columns: ['poShipmentCode']
              isOneToOne: false
              referencedRelation: 'poShipments'
              referencedColumns: ['code']
            }
          ]
        }
        poShipmentItems: {
          Row: {
            archived: boolean
            boxQty: number
            created: string
            id: number
            poItemId: number
            poShipmentCode: string
          }
          Insert: {
            archived?: boolean
            boxQty: number
            created?: string
            id?: number
            poItemId: number
            poShipmentCode: string
          }
          Update: {
            archived?: boolean
            boxQty?: number
            created?: string
            id?: number
            poItemId?: number
            poShipmentCode?: string
          }
          Relationships: [
            {
              foreignKeyName: 'poShipmentItems_poItemId_fkey'
              columns: ['poItemId']
              isOneToOne: false
              referencedRelation: 'purchaseOrderItems'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'poShipmentItems_poShipmentCode_fkey'
              columns: ['poShipmentCode']
              isOneToOne: false
              referencedRelation: 'poShipments'
              referencedColumns: ['code']
            }
          ]
        }
        poShipmentLandedCosts: {
          Row: {
            amount: number
            archived: boolean
            created: string
            currency: Database['public']['Enums']['currency_code_enum']
            id: number
            poShipmentCode: string
            sku: string
          }
          Insert: {
            amount: number
            archived?: boolean
            created?: string
            currency: Database['public']['Enums']['currency_code_enum']
            id?: number
            poShipmentCode: string
            sku: string
          }
          Update: {
            amount?: number
            archived?: boolean
            created?: string
            currency?: Database['public']['Enums']['currency_code_enum']
            id?: number
            poShipmentCode?: string
            sku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'landedCosts_poShipmentCode_fkey'
              columns: ['poShipmentCode']
              isOneToOne: false
              referencedRelation: 'poShipments'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'landedCosts_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'landedCosts_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'landedCosts_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'landedCosts_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            }
          ]
        }
        poShipments: {
          Row: {
            archived: boolean
            bolNumber: string | null
            code: string
            containerNumber: string | null
            created: string
            destination: Database['public']['Enums']['supplier_shipment_destination_enum'] | null
            finalArrivalDate: string | null
            folderId: string | null
            id: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            masterPoCode: string
            mode: Database['public']['Enums']['shipping_mode_enum']
            nthShipment: number
            seller: string
            shipmentType: Database['public']['Enums']['shipmenttype_enum']
            vessel: string
            vesselArrivalDate: string | null
            vesselDepartDate: string | null
            warehouseArrivalDate: string | null
            warehouseCode: string | null
          }
          Insert: {
            archived?: boolean
            bolNumber?: string | null
            code: string
            containerNumber?: string | null
            created?: string
            destination?: Database['public']['Enums']['supplier_shipment_destination_enum'] | null
            finalArrivalDate?: string | null
            folderId?: string | null
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            masterPoCode: string
            mode: Database['public']['Enums']['shipping_mode_enum']
            nthShipment: number
            seller: string
            shipmentType: Database['public']['Enums']['shipmenttype_enum']
            vessel: string
            vesselArrivalDate?: string | null
            vesselDepartDate?: string | null
            warehouseArrivalDate?: string | null
            warehouseCode?: string | null
          }
          Update: {
            archived?: boolean
            bolNumber?: string | null
            code?: string
            containerNumber?: string | null
            created?: string
            destination?: Database['public']['Enums']['supplier_shipment_destination_enum'] | null
            finalArrivalDate?: string | null
            folderId?: string | null
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            masterPoCode?: string
            mode?: Database['public']['Enums']['shipping_mode_enum']
            nthShipment?: number
            seller?: string
            shipmentType?: Database['public']['Enums']['shipmenttype_enum']
            vessel?: string
            vesselArrivalDate?: string | null
            vesselDepartDate?: string | null
            warehouseArrivalDate?: string | null
            warehouseCode?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'poShipments_poCode_fkey'
              columns: ['masterPoCode']
              isOneToOne: false
              referencedRelation: 'purchaseOrders'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'poShipments_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'poShipments_warehouseCode_fkey'
              columns: ['warehouseCode']
              isOneToOne: false
              referencedRelation: 'warehouses'
              referencedColumns: ['poShipmentCode']
            }
          ]
        }
        productBoxConfigurations: {
          Row: {
            archived: boolean
            boxName: string
            created: string
            id: number
            master: boolean
            productSku: string
          }
          Insert: {
            archived?: boolean
            boxName: string
            created?: string
            id?: number
            master: boolean
            productSku: string
          }
          Update: {
            archived?: boolean
            boxName?: string
            created?: string
            id?: number
            master?: boolean
            productSku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'productBoxConfigurations_boxName_fkey'
              columns: ['boxName']
              isOneToOne: false
              referencedRelation: 'masterCartons'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'productBoxConfigurations_productSku_fkey'
              columns: ['productSku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'productBoxConfigurations_productSku_fkey'
              columns: ['productSku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'productBoxConfigurations_productSku_fkey'
              columns: ['productSku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'productBoxConfigurations_productSku_fkey'
              columns: ['productSku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            }
          ]
        }
        productLines: {
          Row: {
            ageRangeDescription: Json
            amazonBrowseNodes: Json
            amazonProductType: string | null
            archived: boolean
            batteriesRequired: boolean | null
            brandId: number
            commodityCodes: Json
            containsLiquidContents: boolean
            countryOfOrigin: Database['public']['Enums']['country_of_origin_enum']
            cpsiaCautionaryStatement: string | null
            created: string
            dangerousHazards: string
            educationalObjective: Json
            euToysSafetyDirectiveAgeWarning: string | null
            euToysSafetyDirectiveWarning: string | null
            hasDoors: boolean
            hasDrawers: boolean
            hasFigurine: boolean
            hasMusic: boolean
            id: number
            includedComponents: Json
            isAssemblyRequired: boolean | null
            itemTypeName: Json
            manufacturerMaxAge: number | null
            manufacturerMinAge: number | null
            material: Json
            name: string
            numOfBoxes: number | null
            numOfItems: number | null
            safetyWarning: Json
            skuCode: string
            targetAudienceKeyword: string
            targetGender: string | null
            warrantyDescription: Json
          }
          Insert: {
            ageRangeDescription: Json
            amazonBrowseNodes: Json
            amazonProductType?: string | null
            archived?: boolean
            batteriesRequired?: boolean | null
            brandId: number
            commodityCodes: Json
            containsLiquidContents?: boolean
            countryOfOrigin: Database['public']['Enums']['country_of_origin_enum']
            cpsiaCautionaryStatement?: string | null
            created?: string
            dangerousHazards?: string
            educationalObjective: Json
            euToysSafetyDirectiveAgeWarning?: string | null
            euToysSafetyDirectiveWarning?: string | null
            hasDoors?: boolean
            hasDrawers?: boolean
            hasFigurine?: boolean
            hasMusic?: boolean
            id?: number
            includedComponents: Json
            isAssemblyRequired?: boolean | null
            itemTypeName: Json
            manufacturerMaxAge?: number | null
            manufacturerMinAge?: number | null
            material: Json
            name: string
            numOfBoxes?: number | null
            numOfItems?: number | null
            safetyWarning: Json
            skuCode: string
            targetAudienceKeyword: string
            targetGender?: string | null
            warrantyDescription: Json
          }
          Update: {
            ageRangeDescription?: Json
            amazonBrowseNodes?: Json
            amazonProductType?: string | null
            archived?: boolean
            batteriesRequired?: boolean | null
            brandId?: number
            commodityCodes?: Json
            containsLiquidContents?: boolean
            countryOfOrigin?: Database['public']['Enums']['country_of_origin_enum']
            cpsiaCautionaryStatement?: string | null
            created?: string
            dangerousHazards?: string
            educationalObjective?: Json
            euToysSafetyDirectiveAgeWarning?: string | null
            euToysSafetyDirectiveWarning?: string | null
            hasDoors?: boolean
            hasDrawers?: boolean
            hasFigurine?: boolean
            hasMusic?: boolean
            id?: number
            includedComponents?: Json
            isAssemblyRequired?: boolean | null
            itemTypeName?: Json
            manufacturerMaxAge?: number | null
            manufacturerMinAge?: number | null
            material?: Json
            name?: string
            numOfBoxes?: number | null
            numOfItems?: number | null
            safetyWarning?: Json
            skuCode?: string
            targetAudienceKeyword?: string
            targetGender?: string | null
            warrantyDescription?: Json
          }
          Relationships: [
            {
              foreignKeyName: 'fk_amazonproducttype_name'
              columns: ['amazonProductType']
              isOneToOne: false
              referencedRelation: 'amazonProductTypes'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'productLines_brandId_fkey'
              columns: ['brandId']
              isOneToOne: false
              referencedRelation: 'brands'
              referencedColumns: ['id']
            }
          ]
        }
        productListings: {
          Row: {
            archived: boolean
            bulletPoints: string[]
            color: string | null
            created: string
            description: string | null
            figurine: string | null
            genericKeywords: string | null
            id: number
            language: Database['public']['Enums']['lang_enum']
            mainKeyword: string | null
            marketplace: Database['public']['Enums']['country_code_enum']
            productId: number
            theme: string | null
            title: string | null
          }
          Insert: {
            archived?: boolean
            bulletPoints?: string[]
            color?: string | null
            created?: string
            description?: string | null
            figurine?: string | null
            genericKeywords?: string | null
            id?: number
            language: Database['public']['Enums']['lang_enum']
            mainKeyword?: string | null
            marketplace: Database['public']['Enums']['country_code_enum']
            productId: number
            theme?: string | null
            title?: string | null
          }
          Update: {
            archived?: boolean
            bulletPoints?: string[]
            color?: string | null
            created?: string
            description?: string | null
            figurine?: string | null
            genericKeywords?: string | null
            id?: number
            language?: Database['public']['Enums']['lang_enum']
            mainKeyword?: string | null
            marketplace?: Database['public']['Enums']['country_code_enum']
            productId?: number
            theme?: string | null
            title?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'productListings_productId_fkey'
              columns: ['productId']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['id']
            }
          ]
        }
        productResearch: {
          Row: {
            amazonProductCategories: Json
            archived: boolean
            asin: string
            brand: string
            breakEvenCalculationInputs:
              | Database['public']['CompositeTypes']['break_even_calculation_inputs']
              | null
            created: string
            id: number
            images: string[]
            landedCostEstimationInputs: Json | null
            landedCostEstimations: Json
            name: string
            packageDimensions: number[]
            packageDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            packageWeight: number
            packageWeightUnit: Database['public']['Enums']['weight_unit_enum']
            productDimensions: number[]
            productDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            productLine: string
            productWeight: number
            productWeightUnit: Database['public']['Enums']['weight_unit_enum']
            reviews: Json | null
            seller: string
            sku: string
          }
          Insert: {
            amazonProductCategories: Json
            archived?: boolean
            asin: string
            brand: string
            breakEvenCalculationInputs?:
              | Database['public']['CompositeTypes']['break_even_calculation_inputs']
              | null
            created?: string
            id?: number
            images: string[]
            landedCostEstimationInputs?: Json | null
            landedCostEstimations: Json
            name: string
            packageDimensions: number[]
            packageDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            packageWeight: number
            packageWeightUnit: Database['public']['Enums']['weight_unit_enum']
            productDimensions: number[]
            productDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            productLine: string
            productWeight: number
            productWeightUnit: Database['public']['Enums']['weight_unit_enum']
            reviews?: Json | null
            seller: string
            sku: string
          }
          Update: {
            amazonProductCategories?: Json
            archived?: boolean
            asin?: string
            brand?: string
            breakEvenCalculationInputs?:
              | Database['public']['CompositeTypes']['break_even_calculation_inputs']
              | null
            created?: string
            id?: number
            images?: string[]
            landedCostEstimationInputs?: Json | null
            landedCostEstimations?: Json
            name?: string
            packageDimensions?: number[]
            packageDimensionsUnit?: Database['public']['Enums']['length_unit_enum']
            packageWeight?: number
            packageWeightUnit?: Database['public']['Enums']['weight_unit_enum']
            productDimensions?: number[]
            productDimensionsUnit?: Database['public']['Enums']['length_unit_enum']
            productLine?: string
            productWeight?: number
            productWeightUnit?: Database['public']['Enums']['weight_unit_enum']
            reviews?: Json | null
            seller?: string
            sku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'productResearch_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        productResearchByMarketplace: {
          Row: {
            actualPrice: number | null
            amazonBrowseNode: string | null
            archived: boolean
            created: string
            fbaFeeCategory: Database['public']['Enums']['fba_fee_category_enum']
            id: number
            marketplace: Database['public']['Enums']['country_code_enum']
            productResearchId: number
            targetPrice: number | null
            targetProfitMargin: number | null
            targetRoi: number | null
            vatRate: number | null
          }
          Insert: {
            actualPrice?: number | null
            amazonBrowseNode?: string | null
            archived?: boolean
            created?: string
            fbaFeeCategory?: Database['public']['Enums']['fba_fee_category_enum']
            id?: number
            marketplace: Database['public']['Enums']['country_code_enum']
            productResearchId: number
            targetPrice?: number | null
            targetProfitMargin?: number | null
            targetRoi?: number | null
            vatRate?: number | null
          }
          Update: {
            actualPrice?: number | null
            amazonBrowseNode?: string | null
            archived?: boolean
            created?: string
            fbaFeeCategory?: Database['public']['Enums']['fba_fee_category_enum']
            id?: number
            marketplace?: Database['public']['Enums']['country_code_enum']
            productResearchId?: number
            targetPrice?: number | null
            targetProfitMargin?: number | null
            targetRoi?: number | null
            vatRate?: number | null
          }
          Relationships: [
            {
              foreignKeyName: 'productResearchByMarketplace_productResearchId_fkey'
              columns: ['productResearchId']
              isOneToOne: false
              referencedRelation: 'productResearch'
              referencedColumns: ['id']
            }
          ]
        }
        productResearchListings: {
          Row: {
            archived: boolean
            bulletPoints: string[]
            created: string
            description: string | null
            genericKeywords: string | null
            id: number
            language: Database['public']['Enums']['lang_enum']
            marketplace: Database['public']['Enums']['country_code_enum']
            productResearchId: number
            title: string | null
          }
          Insert: {
            archived?: boolean
            bulletPoints?: string[]
            created?: string
            description?: string | null
            genericKeywords?: string | null
            id?: number
            language: Database['public']['Enums']['lang_enum']
            marketplace: Database['public']['Enums']['country_code_enum']
            productResearchId: number
            title?: string | null
          }
          Update: {
            archived?: boolean
            bulletPoints?: string[]
            created?: string
            description?: string | null
            genericKeywords?: string | null
            id?: number
            language?: Database['public']['Enums']['lang_enum']
            marketplace?: Database['public']['Enums']['country_code_enum']
            productResearchId?: number
            title?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'productResearchListings_productResearchId_fkey'
              columns: ['productResearchId']
              isOneToOne: false
              referencedRelation: 'productResearch'
              referencedColumns: ['id']
            }
          ]
        }
        products: {
          Row: {
            amazonProductCategories: Json
            archived: boolean
            asin: string | null
            breakEvenCalculationInputs:
              | Database['public']['CompositeTypes']['break_even_calculation_inputs']
              | null
            created: string
            designId: number | null
            gtin: string | null
            id: number
            images: string[]
            isCustom: boolean
            landedCostEstimationInputs: Json | null
            landedCostEstimations: Json
            music: string | null
            name: string
            numOfDoors: number | null
            numOfDrawers: number | null
            packageDimensions: number[]
            packageDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            packageWeight: number
            packageWeightUnit: Database['public']['Enums']['weight_unit_enum']
            parentSku: string | null
            productDimensions: number[]
            productDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            productLine: string
            productWeight: number
            productWeightUnit: Database['public']['Enums']['weight_unit_enum']
            reviews: Json | null
            sku: string
            skuNumericCode: number
            supplier: string
          }
          Insert: {
            amazonProductCategories: Json
            archived?: boolean
            asin?: string | null
            breakEvenCalculationInputs?:
              | Database['public']['CompositeTypes']['break_even_calculation_inputs']
              | null
            created?: string
            designId?: number | null
            gtin?: string | null
            id?: number
            images: string[]
            isCustom?: boolean
            landedCostEstimationInputs?: Json | null
            landedCostEstimations: Json
            music?: string | null
            name: string
            numOfDoors?: number | null
            numOfDrawers?: number | null
            packageDimensions: number[]
            packageDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            packageWeight: number
            packageWeightUnit: Database['public']['Enums']['weight_unit_enum']
            parentSku?: string | null
            productDimensions: number[]
            productDimensionsUnit: Database['public']['Enums']['length_unit_enum']
            productLine: string
            productWeight: number
            productWeightUnit: Database['public']['Enums']['weight_unit_enum']
            reviews?: Json | null
            sku: string
            skuNumericCode: number
            supplier: string
          }
          Update: {
            amazonProductCategories?: Json
            archived?: boolean
            asin?: string | null
            breakEvenCalculationInputs?:
              | Database['public']['CompositeTypes']['break_even_calculation_inputs']
              | null
            created?: string
            designId?: number | null
            gtin?: string | null
            id?: number
            images?: string[]
            isCustom?: boolean
            landedCostEstimationInputs?: Json | null
            landedCostEstimations?: Json
            music?: string | null
            name?: string
            numOfDoors?: number | null
            numOfDrawers?: number | null
            packageDimensions?: number[]
            packageDimensionsUnit?: Database['public']['Enums']['length_unit_enum']
            packageWeight?: number
            packageWeightUnit?: Database['public']['Enums']['weight_unit_enum']
            parentSku?: string | null
            productDimensions?: number[]
            productDimensionsUnit?: Database['public']['Enums']['length_unit_enum']
            productLine?: string
            productWeight?: number
            productWeightUnit?: Database['public']['Enums']['weight_unit_enum']
            reviews?: Json | null
            sku?: string
            skuNumericCode?: number
            supplier?: string
          }
          Relationships: [
            {
              foreignKeyName: 'fk_product_productline'
              columns: ['productLine']
              isOneToOne: false
              referencedRelation: 'productLines'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'products_designId_fkey'
              columns: ['designId']
              isOneToOne: false
              referencedRelation: 'designs'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'products_gtin_fkey'
              columns: ['gtin']
              isOneToOne: true
              referencedRelation: 'barcodes'
              referencedColumns: ['gtin']
            },
            {
              foreignKeyName: 'products_music_fkey'
              columns: ['music']
              isOneToOne: false
              referencedRelation: 'music'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'products_parentSku_fkey'
              columns: ['parentSku']
              isOneToOne: false
              referencedRelation: 'parentProducts'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'products_supplier_fkey'
              columns: ['supplier']
              isOneToOne: false
              referencedRelation: 'suppliers'
              referencedColumns: ['name']
            }
          ]
        }
        productsByMarketplace: {
          Row: {
            actualPrice: number | null
            amazonBrowseNode: string | null
            archived: boolean
            created: string
            fbaFeeCategory: Database['public']['Enums']['fba_fee_category_enum']
            id: number
            marketplace: Database['public']['Enums']['country_code_enum']
            productId: number
            targetPrice: number | null
            targetProfitMargin: number | null
            targetRoi: number | null
            vatRate: number | null
          }
          Insert: {
            actualPrice?: number | null
            amazonBrowseNode?: string | null
            archived?: boolean
            created?: string
            fbaFeeCategory?: Database['public']['Enums']['fba_fee_category_enum']
            id?: number
            marketplace: Database['public']['Enums']['country_code_enum']
            productId: number
            targetPrice?: number | null
            targetProfitMargin?: number | null
            targetRoi?: number | null
            vatRate?: number | null
          }
          Update: {
            actualPrice?: number | null
            amazonBrowseNode?: string | null
            archived?: boolean
            created?: string
            fbaFeeCategory?: Database['public']['Enums']['fba_fee_category_enum']
            id?: number
            marketplace?: Database['public']['Enums']['country_code_enum']
            productId?: number
            targetPrice?: number | null
            targetProfitMargin?: number | null
            targetRoi?: number | null
            vatRate?: number | null
          }
          Relationships: [
            {
              foreignKeyName: 'productsByMarketplace_productId_fkey'
              columns: ['productId']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['id']
            }
          ]
        }
        productSkuAliases: {
          Row: {
            alias: string
            archived: boolean
            created: string
            id: number
            master: boolean
            sku: string
          }
          Insert: {
            alias: string
            archived?: boolean
            created?: string
            id?: number
            master: boolean
            sku: string
          }
          Update: {
            alias?: string
            archived?: boolean
            created?: string
            id?: number
            master?: boolean
            sku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'productSkuAliases_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'productSkuAliases_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'productSkuAliases_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'productSkuAliases_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            }
          ]
        }
        purchaseOrderItems: {
          Row: {
            amount: number | null
            archived: boolean
            boxQty: number
            created: string
            currency: Database['public']['Enums']['currency_code_enum']
            id: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            masterCartonId: number
            poCode: string
            sku: string
          }
          Insert: {
            amount?: number | null
            archived?: boolean
            boxQty: number
            created?: string
            currency: Database['public']['Enums']['currency_code_enum']
            id?: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            masterCartonId: number
            poCode: string
            sku: string
          }
          Update: {
            amount?: number | null
            archived?: boolean
            boxQty?: number
            created?: string
            currency?: Database['public']['Enums']['currency_code_enum']
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum']
            masterCartonId?: number
            poCode?: string
            sku?: string
          }
          Relationships: [
            {
              foreignKeyName: 'purchaseOrderItems_masterCartonId_fkey'
              columns: ['masterCartonId']
              isOneToOne: false
              referencedRelation: 'masterCartons'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'purchaseOrderItems_poCode_fkey'
              columns: ['poCode']
              isOneToOne: false
              referencedRelation: 'purchaseOrders'
              referencedColumns: ['code']
            },
            {
              foreignKeyName: 'purchaseOrderItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'orders'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'purchaseOrderItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersForForecast'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'purchaseOrderItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'ordersUsd'
              referencedColumns: ['sku']
            },
            {
              foreignKeyName: 'purchaseOrderItems_sku_fkey'
              columns: ['sku']
              isOneToOne: false
              referencedRelation: 'products'
              referencedColumns: ['sku']
            }
          ]
        }
        purchaseOrders: {
          Row: {
            archived: boolean
            b2bFobCompletionDate: string | null
            b2bPoNumber: string | null
            brandCode: string
            code: string
            created: string
            folderId: string | null
            id: number
            isB2bFob: boolean
            nthPo: number
            poType: Database['public']['Enums']['po_type_enum']
            submitDate: string | null
            supplierCode: string
          }
          Insert: {
            archived?: boolean
            b2bFobCompletionDate?: string | null
            b2bPoNumber?: string | null
            brandCode: string
            code: string
            created?: string
            folderId?: string | null
            id?: number
            isB2bFob: boolean
            nthPo: number
            poType: Database['public']['Enums']['po_type_enum']
            submitDate?: string | null
            supplierCode: string
          }
          Update: {
            archived?: boolean
            b2bFobCompletionDate?: string | null
            b2bPoNumber?: string | null
            brandCode?: string
            code?: string
            created?: string
            folderId?: string | null
            id?: number
            isB2bFob?: boolean
            nthPo?: number
            poType?: Database['public']['Enums']['po_type_enum']
            submitDate?: string | null
            supplierCode?: string
          }
          Relationships: [
            {
              foreignKeyName: 'purchaseOrders_brandCode_fkey'
              columns: ['brandCode']
              isOneToOne: false
              referencedRelation: 'brands'
              referencedColumns: ['poCode']
            },
            {
              foreignKeyName: 'purchaseOrders_supplierCode_fkey'
              columns: ['supplierCode']
              isOneToOne: false
              referencedRelation: 'suppliers'
              referencedColumns: ['poCode']
            }
          ]
        }
        sellers: {
          Row: {
            amazonShipmentCode: string | null
            archived: boolean
            awdShipmentsFolderId: string | null
            created: string
            fbaShipmentsFolderId: string | null
            id: number
            name: string
          }
          Insert: {
            amazonShipmentCode?: string | null
            archived?: boolean
            awdShipmentsFolderId?: string | null
            created?: string
            fbaShipmentsFolderId?: string | null
            id?: number
            name: string
          }
          Update: {
            amazonShipmentCode?: string | null
            archived?: boolean
            awdShipmentsFolderId?: string | null
            created?: string
            fbaShipmentsFolderId?: string | null
            id?: number
            name?: string
          }
          Relationships: []
        }
        sellerUser: {
          Row: {
            archived: boolean
            created: string
            id: number
            sellerId: number
            userId: string
          }
          Insert: {
            archived?: boolean
            created?: string
            id?: number
            sellerId: number
            userId: string
          }
          Update: {
            archived?: boolean
            created?: string
            id?: number
            sellerId?: number
            userId?: string
          }
          Relationships: [
            {
              foreignKeyName: 'sellerUser_sellerId_fkey'
              columns: ['sellerId']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['id']
            }
          ]
        }
        settings: {
          Row: {
            archived: boolean
            baseCurrency: Database['public']['Enums']['currency_code_enum']
            created: string
            id: number
            rounding: Database['public']['CompositeTypes']['rounding']
          }
          Insert: {
            archived?: boolean
            baseCurrency: Database['public']['Enums']['currency_code_enum']
            created?: string
            id?: number
            rounding: Database['public']['CompositeTypes']['rounding']
          }
          Update: {
            archived?: boolean
            baseCurrency?: Database['public']['Enums']['currency_code_enum']
            created?: string
            id?: number
            rounding?: Database['public']['CompositeTypes']['rounding']
          }
          Relationships: []
        }
        settingsShippingCosts: {
          Row: {
            archived: boolean
            cost: number | null
            created: string
            currency: Database['public']['Enums']['currency_code_enum']
            freightSize: Database['public']['Enums']['freight_size_enum']
            id: number
            port: Database['public']['Enums']['port_of_origin_enum']
            region: Database['public']['Enums']['inventory_region_enum']
            settingsId: number
          }
          Insert: {
            archived?: boolean
            cost?: number | null
            created?: string
            currency: Database['public']['Enums']['currency_code_enum']
            freightSize: Database['public']['Enums']['freight_size_enum']
            id?: number
            port: Database['public']['Enums']['port_of_origin_enum']
            region: Database['public']['Enums']['inventory_region_enum']
            settingsId: number
          }
          Update: {
            archived?: boolean
            cost?: number | null
            created?: string
            currency?: Database['public']['Enums']['currency_code_enum']
            freightSize?: Database['public']['Enums']['freight_size_enum']
            id?: number
            port?: Database['public']['Enums']['port_of_origin_enum']
            region?: Database['public']['Enums']['inventory_region_enum']
            settingsId?: number
          }
          Relationships: [
            {
              foreignKeyName: 'settingsShippingCosts_settingsId_fkey'
              columns: ['settingsId']
              isOneToOne: false
              referencedRelation: 'settings'
              referencedColumns: ['id']
            }
          ]
        }
        settingsTargetProfitability: {
          Row: {
            archived: boolean
            created: string
            id: number
            marketplace: Database['public']['Enums']['country_code_enum']
            settingsId: number
            targetProfitMargin: number
            targetRoi: number
          }
          Insert: {
            archived?: boolean
            created?: string
            id?: number
            marketplace: Database['public']['Enums']['country_code_enum']
            settingsId: number
            targetProfitMargin: number
            targetRoi: number
          }
          Update: {
            archived?: boolean
            created?: string
            id?: number
            marketplace?: Database['public']['Enums']['country_code_enum']
            settingsId?: number
            targetProfitMargin?: number
            targetRoi?: number
          }
          Relationships: [
            {
              foreignKeyName: 'settingsTargetProfitability_settingsId_fkey'
              columns: ['settingsId']
              isOneToOne: false
              referencedRelation: 'settings'
              referencedColumns: ['id']
            }
          ]
        }
        suppliers: {
          Row: {
            archived: boolean
            created: string
            id: number
            name: string
            poCode: string
            portOfOrigin: Database['public']['Enums']['port_of_origin_enum']
          }
          Insert: {
            archived?: boolean
            created?: string
            id?: number
            name: string
            poCode: string
            portOfOrigin: Database['public']['Enums']['port_of_origin_enum']
          }
          Update: {
            archived?: boolean
            created?: string
            id?: number
            name?: string
            poCode?: string
            portOfOrigin?: Database['public']['Enums']['port_of_origin_enum']
          }
          Relationships: []
        }
        supplierSeller: {
          Row: {
            archived: boolean
            created: string
            id: number
            seller: string
            supplier: string
          }
          Insert: {
            archived?: boolean
            created?: string
            id?: number
            seller: string
            supplier: string
          }
          Update: {
            archived?: boolean
            created?: string
            id?: number
            seller?: string
            supplier?: string
          }
          Relationships: [
            {
              foreignKeyName: 'supplierSeller_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'supplierSeller_supplier_fkey'
              columns: ['supplier']
              isOneToOne: false
              referencedRelation: 'suppliers'
              referencedColumns: ['name']
            }
          ]
        }
        translations: {
          Row: {
            archived: boolean
            created: string
            fromMarketplace: Database['public']['Enums']['country_code_enum']
            id: string
            items: Json
            seller: string
            status: Database['public']['Enums']['translation_status_enum']
            toMarketplace: Database['public']['Enums']['country_code_enum']
          }
          Insert: {
            archived?: boolean
            created?: string
            fromMarketplace: Database['public']['Enums']['country_code_enum']
            id?: string
            items: Json
            seller: string
            status: Database['public']['Enums']['translation_status_enum']
            toMarketplace: Database['public']['Enums']['country_code_enum']
          }
          Update: {
            archived?: boolean
            created?: string
            fromMarketplace?: Database['public']['Enums']['country_code_enum']
            id?: string
            items?: Json
            seller?: string
            status?: Database['public']['Enums']['translation_status_enum']
            toMarketplace?: Database['public']['Enums']['country_code_enum']
          }
          Relationships: [
            {
              foreignKeyName: 'translations_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        warehouses: {
          Row: {
            address: Database['public']['CompositeTypes']['address'] | null
            archived: boolean
            created: string
            fbaContact: Database['public']['CompositeTypes']['contact_details'] | null
            id: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            name: string
            poShipmentCode: string
          }
          Insert: {
            address?: Database['public']['CompositeTypes']['address'] | null
            archived?: boolean
            created?: string
            fbaContact?: Database['public']['CompositeTypes']['contact_details'] | null
            id?: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            name: string
            poShipmentCode: string
          }
          Update: {
            address?: Database['public']['CompositeTypes']['address'] | null
            archived?: boolean
            created?: string
            fbaContact?: Database['public']['CompositeTypes']['contact_details'] | null
            id?: number
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum']
            name?: string
            poShipmentCode?: string
          }
          Relationships: []
        }
        warehouseSeller: {
          Row: {
            archived: boolean
            created: string
            id: number
            seller: string
            warehouse: string
          }
          Insert: {
            archived?: boolean
            created?: string
            id?: number
            seller: string
            warehouse: string
          }
          Update: {
            archived?: boolean
            created?: string
            id?: number
            seller?: string
            warehouse?: string
          }
          Relationships: [
            {
              foreignKeyName: 'warehouseSeller_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'warehouseSeller_warehouse_fkey'
              columns: ['warehouse']
              isOneToOne: false
              referencedRelation: 'warehouses'
              referencedColumns: ['name']
            }
          ]
        }
      }
      Views: {
        amazonOrdersWithoutRemovals: {
          Row: {
            amazonOrderId: string | null
            archived: boolean | null
            created: string | null
            fulfillmentChannel: string | null
            id: number | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            isBusinessOrder: boolean | null
            isIba: boolean | null
            lastUpdatedDate: string | null
            localPurchaseDate: string | null
            marketplace: Database['public']['Enums']['country_code_enum'] | null
            merchantOrderId: string | null
            orderStatus: string | null
            purchaseDate: string | null
            purchaseOrderNumber: string | null
            region: Database['spapi']['Enums']['region_enum'] | null
            salesChannel: string | null
            seller: string | null
            shipCity: string | null
            shipCountry: string | null
            shipPostalCode: string | null
            shipPromotionDiscount: number | null
            shipServiceLevel: string | null
            shipState: string | null
          }
          Insert: {
            amazonOrderId?: string | null
            archived?: boolean | null
            created?: string | null
            fulfillmentChannel?: string | null
            id?: number | null
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            isBusinessOrder?: boolean | null
            isIba?: boolean | null
            lastUpdatedDate?: string | null
            localPurchaseDate?: string | null
            marketplace?: Database['public']['Enums']['country_code_enum'] | null
            merchantOrderId?: string | null
            orderStatus?: string | null
            purchaseDate?: string | null
            purchaseOrderNumber?: string | null
            region?: Database['spapi']['Enums']['region_enum'] | null
            salesChannel?: string | null
            seller?: string | null
            shipCity?: string | null
            shipCountry?: string | null
            shipPostalCode?: string | null
            shipPromotionDiscount?: number | null
            shipServiceLevel?: string | null
            shipState?: string | null
          }
          Update: {
            amazonOrderId?: string | null
            archived?: boolean | null
            created?: string | null
            fulfillmentChannel?: string | null
            id?: number | null
            inventoryRegion?: Database['public']['Enums']['inventory_region_enum'] | null
            isBusinessOrder?: boolean | null
            isIba?: boolean | null
            lastUpdatedDate?: string | null
            localPurchaseDate?: string | null
            marketplace?: Database['public']['Enums']['country_code_enum'] | null
            merchantOrderId?: string | null
            orderStatus?: string | null
            purchaseDate?: string | null
            purchaseOrderNumber?: string | null
            region?: Database['spapi']['Enums']['region_enum'] | null
            salesChannel?: string | null
            seller?: string | null
            shipCity?: string | null
            shipCountry?: string | null
            shipPostalCode?: string | null
            shipPromotionDiscount?: number | null
            shipServiceLevel?: string | null
            shipState?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'orders_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        base_inventory_ledger_gaps: {
          Row: {
            boxQty: number | null
            code: string | null
            date: string | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            sku: string | null
            stage: Database['public']['Enums']['inventory_stage_enum'] | null
            unitQty: number | null
            unitsPerBox: number | null
            valueUsd: number | null
            warehouse: string | null
          }
          Relationships: []
        }
        inventoryLedger: {
          Row: {
            boxQty: number | null
            code: string | null
            date: string | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            sku: string | null
            stage: Database['public']['Enums']['inventory_stage_enum'] | null
            unitQty: number | null
            unitsPerBox: number | null
            valueUsd: number | null
            warehouse: string | null
          }
          Relationships: []
        }
        landed_cost_ledger_gaps: {
          Row: {
            averageLandedCost: number | null
            currency: Database['public']['Enums']['currency_code_enum'] | null
            date: string | null
            incomingUnitLandedCost: number | null
            incomingUnitQty: number | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            landedUnitLandedCost: number | null
            landedUnitQty: number | null
            poShipmentCode: string | null
            shipmentType: Database['public']['Enums']['shipmenttype_enum'] | null
            sku: string | null
          }
          Relationships: []
        }
        orders: {
          Row: {
            date: string | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            marketplace: Database['public']['Enums']['country_code_enum'] | null
            salesChannel: Database['public']['Enums']['sales_channel_enum'] | null
            sku: string | null
            unitQty: number | null
          }
          Relationships: []
        }
        ordersForForecast: {
          Row: {
            brand: string | null
            date: string | null
            design: string | null
            endingFbaAvailableUnits: number | null
            fbaInTransitUnits: number | null
            fbaStatus: string | null
            figurine: string | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            numOfDoors: number | null
            numOfDrawers: number | null
            parentSku: string | null
            productLine: string | null
            seller: string | null
            sku: string | null
            startingFbaAvailableUnits: number | null
            unitsOrdered: number | null
            volume: number | null
          }
          Relationships: [
            {
              foreignKeyName: 'fk_product_productline'
              columns: ['productLine']
              isOneToOne: false
              referencedRelation: 'productLines'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'orders_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'products_parentSku_fkey'
              columns: ['parentSku']
              isOneToOne: false
              referencedRelation: 'parentProducts'
              referencedColumns: ['sku']
            }
          ]
        }
        ordersUsd: {
          Row: {
            date: string | null
            design: string | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            itemPriceUsdNoVat: number | null
            marketplace: Database['public']['Enums']['country_code_enum'] | null
            parentSku: string | null
            productLine: string | null
            region: Database['spapi']['Enums']['region_enum'] | null
            salesChannel: Database['public']['Enums']['sales_channel_enum'] | null
            sku: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'fk_product_productline'
              columns: ['productLine']
              isOneToOne: false
              referencedRelation: 'productLines'
              referencedColumns: ['name']
            },
            {
              foreignKeyName: 'products_parentSku_fkey'
              columns: ['parentSku']
              isOneToOne: false
              referencedRelation: 'parentProducts'
              referencedColumns: ['sku']
            }
          ]
        }
        sellerTokens: {
          Row: {
            awd: boolean | null
            id: number | null
            isSpapiReady: boolean | null
            marketplaces: Database['public']['Enums']['country_code_enum'][] | null
            merchantToken: string | null
            region: Database['spapi']['Enums']['region_enum'] | null
            seller: string | null
          }
          Insert: {
            awd?: boolean | null
            id?: number | null
            isSpapiReady?: boolean | null
            marketplaces?: Database['public']['Enums']['country_code_enum'][] | null
            merchantToken?: string | null
            region?: Database['spapi']['Enums']['region_enum'] | null
            seller?: string | null
          }
          Update: {
            awd?: boolean | null
            id?: number | null
            isSpapiReady?: boolean | null
            marketplaces?: Database['public']['Enums']['country_code_enum'][] | null
            merchantToken?: string | null
            region?: Database['spapi']['Enums']['region_enum'] | null
            seller?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'refreshTokens_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
      }
      Functions: {
        adjust_po_item_regions: {
          Args: {
            box_qty_increment: number
            id_to_increment: number
            id_to_decrement: number
          }
          Returns: undefined
        }
        awd_unallocated_po_shipment_items: {
          Args: Record<PropertyKey, never>
          Returns: {
            poShipmentCode: string
            sku: string
            masterCartonId: number
            unitsPerBox: number
            unallocatedBoxQty: number
          }[]
        }
        awdInventoryLedger: {
          Args: {
            '': unknown
          }
          Returns: {
            archived: boolean | null
            asin: string | null
            country: string | null
            created: string | null
            date: string | null
            departedCartons: number | null
            endingWarehouseBalance: number | null
            fnsku: string | null
            id: number | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
            msku: string | null
            purchaseOrderId: string | null
            receivedCartons: number | null
            seller: string | null
            sku: string | null
            spapiRegion: Database['spapi']['Enums']['region_enum'] | null
            startingWarehouseBalance: number | null
            unitsPerCarton: number | null
          }[]
        }
        citext:
          | {
              Args: {
                '': boolean
              }
              Returns: string
            }
          | {
              Args: {
                '': string
              }
              Returns: string
            }
          | {
              Args: {
                '': unknown
              }
              Returns: string
            }
        citext_hash: {
          Args: {
            '': string
          }
          Returns: number
        }
        citextin: {
          Args: {
            '': unknown
          }
          Returns: string
        }
        citextout: {
          Args: {
            '': string
          }
          Returns: unknown
        }
        citextrecv: {
          Args: {
            '': unknown
          }
          Returns: string
        }
        citextsend: {
          Args: {
            '': string
          }
          Returns: string
        }
        delete_inventory_ledger_awdships: {
          Args: {
            awd_shipment_codes: string[]
          }
          Returns: undefined
        }
        delete_inventory_ledger_fbaships: {
          Args: {
            fba_shipment_codes: string[]
          }
          Returns: undefined
        }
        delete_inventory_ledger_pos: {
          Args: {
            po_codes: string[]
          }
          Returns: undefined
        }
        delete_inventory_ledger_poships: {
          Args: {
            po_shipment_codes: string[]
          }
          Returns: undefined
        }
        find_awd_shipment_first_received: {
          Args: {
            amazon_reference_id: string
          }
          Returns: string
        }
        get_aggregate_settlements: {
          Args: {
            settlement_ids: number[]
          }
          Returns: {
            settlementId: number
            transactionType: string
            amountType: string
            amountDescription: string
            localPostedMonth: string
            totalAmount: number
          }[]
        }
        get_aggregated_cogs_by_settlement: {
          Args: {
            settlement_ids: number[]
          }
          Returns: {
            settlementId: number
            localPostedMonth: string
            totalUsdAmount: number
          }[]
        }
        get_awd_inventory: {
          Args: {
            inventory_date: string
          }
          Returns: {
            sku: string
            unitsPerBox: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            boxQty: number
            unitQty: number
          }[]
        }
        get_awd_inventory_ledger: {
          Args: Record<PropertyKey, never>
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_b2b_fob_pos_completed: {
          Args: {
            po_codes?: string[]
          }
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_daily_orders: {
          Args: {
            channel: Database['public']['Enums']['sales_channel_enum']
            region: Database['public']['Enums']['inventory_region_enum']
            from_date: string
            to_date: string
          }
          Returns: {
            date: string
            sku: string
            unitQty: number
          }[]
        }
        get_default_language: {
          Args: {
            marketplace: Database['public']['Enums']['country_code_enum']
          }
          Returns: Database['public']['Enums']['lang_enum']
        }
        get_eom_fba_inventory: {
          Args: {
            region: Database['public']['Enums']['inventory_region_enum']
            yr: number
          }
          Returns: {
            date: string
            sku: string
            unitQty: number
          }[]
        }
        get_fba_inventory: {
          Args: {
            inventory_date: string
          }
          Returns: {
            seller: string
            brand: string
            productLine: string
            sku: string
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            unitQty: number
          }[]
        }
        get_fba_inventory_ledger: {
          Args: Record<PropertyKey, never>
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_inventory: {
          Args: {
            inventory_date: string
          }
          Returns: {
            seller: string
            brand: string
            productLine: string
            sku: string
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            stage: Database['public']['Enums']['inventory_stage_enum']
            boxQty: number
            unitQty: number
            valueUsd: number
          }[]
        }
        get_inventory_ledger_adjustments: {
          Args: Record<PropertyKey, never>
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_inventory_with_value: {
          Args: {
            inventory_date: string
          }
          Returns: {
            seller: string
            brand: string
            productLine: string
            sku: string
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            stage: Database['public']['Enums']['inventory_stage_enum']
            boxQty: number
            unitQty: number
            valueUsd: number
          }[]
        }
        get_item_price_no_vat: {
          Args: {
            marketplace: Database['public']['Enums']['country_code_enum']
            item_price: number
            item_tax: number
          }
          Returns: number
        }
        get_landed_cost_history: {
          Args: Record<PropertyKey, never>
          Returns: Database['public']['CompositeTypes']['landed_cost'][]
        }
        get_landed_costs: {
          Args: {
            lc_date: string
          }
          Returns: {
            archived: boolean
            averageLandedCost: number
            created: string
            currency: Database['public']['Enums']['currency_code_enum']
            date: string
            id: number
            incomingUnitLandedCost: number | null
            incomingUnitQty: number | null
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            landedUnitLandedCost: number | null
            landedUnitQty: number
            poShipmentCode: string
            rowIndex: number
            shipmentType: Database['public']['Enums']['shipmenttype_enum']
            sku: string
          }[]
        }
        get_local_date: {
          Args: {
            input_date: string
            marketplace: Database['public']['Enums']['country_code_enum']
          }
          Returns: string
        }
        get_local_timezone: {
          Args: {
            marketplace: Database['public']['Enums']['country_code_enum']
          }
          Returns: string
        }
        get_monthly_average_fx_rates: {
          Args: {
            start_month: string
            end_month: string
          }
          Returns: {
            month: string
            baseCurrency: Database['public']['Enums']['currency_code_enum']
            quoteCurrency: Database['public']['Enums']['currency_code_enum']
            averageRate: number
          }[]
        }
        get_monthly_orders: {
          Args: {
            channel: Database['public']['Enums']['sales_channel_enum']
            region: Database['public']['Enums']['inventory_region_enum']
            from_month: string
            to_month: string
            max_date?: string
          }
          Returns: {
            month: string
            sku: string
            unitQty: number
          }[]
        }
        get_non_amazon_po_shipment_arrivals_in_transit: {
          Args: {
            po_shipment_codes?: string[]
          }
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_po_shipment_arrivals_warehouse: {
          Args: {
            po_shipment_codes?: string[]
          }
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_po_shipments_departure: {
          Args: {
            po_shipment_codes?: string[]
          }
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_pos_in_production: {
          Args: {
            po_codes?: string[]
          }
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_reserved_awd_shipments_from_warehouse: {
          Args: {
            awd_shipment_codes?: string[]
          }
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_reserved_fba_shipments_from_warehouse: {
          Args: {
            fba_shipment_codes?: string[]
          }
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_settlement_skus_without_landed_cost: {
          Args: {
            settlement_ids: number[]
          }
          Returns: {
            settlementId: number
            sku: string
          }[]
        }
        get_shipped_and_received_awd_shipments: {
          Args: {
            awd_shipment_codes?: string[]
          }
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_shipped_fba_shipments: {
          Args: {
            fba_shipment_codes?: string[]
          }
          Returns: Database['public']['CompositeTypes']['inventory_transaction'][]
        }
        get_warehouse_inventory: {
          Args: {
            inventory_date: string
            excluded_shipment_codes?: string[]
          }
          Returns: {
            seller: string
            brand: string
            productLine: string
            sku: string
            unitsPerBox: number
            inventoryRegion: Database['public']['Enums']['inventory_region_enum']
            warehouse: string
            stage: Database['public']['Enums']['inventory_stage_enum']
            boxQty: number
            unitQty: number
            valueUsd: number
          }[]
        }
        insert_amazon_settlement_items_if_not_exists: {
          Args: {
            items: Database['public']['Tables']['amazonSettlementItems']['Row'][]
          }
          Returns: undefined
        }
        invoke_edge_function: {
          Args: {
            function_name: string
            body: Json
            params?: Json
          }
          Returns: number
        }
        is_in_transit: {
          Args: {
            shipment: unknown
            inventory_date: string
          }
          Returns: boolean
        }
        is_in_warehouse: {
          Args: {
            shipment: unknown
            inventory_date: string
          }
          Returns: boolean
        }
        jsonb_array_to_text_array: {
          Args: {
            _js: Json
          }
          Returns: string[]
        }
        prod: {
          Args: {
            arr: number[]
          }
          Returns: number
        }
        set_awd_shipment_items:
          | {
              Args: {
                awd_shipment_code: string
                items: Database['public']['Tables']['awdShipmentItems']['Row'][]
              }
              Returns: undefined
            }
          | {
              Args: {
                items: Database['public']['Tables']['awdShipmentItems']['Row'][]
              }
              Returns: undefined
            }
        set_inventory_ledger_awdships: {
          Args: {
            awd_shipment_codes: string[]
          }
          Returns: undefined
        }
        set_inventory_ledger_fbaships: {
          Args: {
            fba_shipment_codes: string[]
          }
          Returns: undefined
        }
        set_inventory_ledger_pos: {
          Args: {
            po_codes: string[]
          }
          Returns: undefined
        }
        set_inventory_ledger_poships: {
          Args: {
            po_shipment_codes: string[]
          }
          Returns: undefined
        }
        set_landed_cost_ledger: {
          Args: {
            from_date?: string
            regions?: Database['public']['Enums']['inventory_region_enum'][]
            shipment_types?: Database['public']['Enums']['shipmenttype_enum'][]
          }
          Returns: undefined
        }
        set_parent_product_box_configurations: {
          Args: {
            sku: string
            configs: Database['public']['CompositeTypes']['box_configuration_param'][]
          }
          Returns: undefined
        }
        set_product_box_configurations: {
          Args: {
            sku: string
            configs: Database['public']['CompositeTypes']['box_configuration_param'][]
          }
          Returns: undefined
        }
        total_po_shipment_boxes_allocated_to_awd_shipments: {
          Args: {
            po_shipment_code: string
            sku_param: string
            master_carton_id: number
          }
          Returns: number
        }
      }
      Enums: {
        amazon_settlement_status_enum: 'Open' | 'Invalid' | 'Closed'
        barcode_provider_enum: 'GS1'
        barcode_type_enum: 'UPC' | 'EAN'
        country_code_enum:
          | 'US'
          | 'GB'
          | 'DE'
          | 'FR'
          | 'IT'
          | 'ES'
          | 'CA'
          | 'AU'
          | 'MX'
          | 'NL'
          | 'BE'
          | 'SE'
          | 'PL'
          | 'BR'
        country_of_origin_enum: 'CN'
        currency_code_enum: 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD' | 'MXN' | 'SEK' | 'PLN' | 'BRL'
        designtype_enum: 'In-house' | 'Stock' | 'Custom'
        fba_fee_category_enum: 'default' | 'apparel' | 'hazmat'
        fba_shipment_owner_enum: 'Amazon' | 'Seller'
        fba_shipment_type_enum: 'SP' | 'LTL'
        freight_size_enum: "20'" | "40'" | "40'HQ" | "45'"
        import_cost_type_enum: 'Freight' | 'Duties'
        inventory_region_enum: 'US' | 'GB' | 'EU' | 'CA' | 'AU'
        inventory_stage_enum: 'Production' | 'In Transit' | 'Warehouse' | 'Reserved' | 'AWD' | 'FBA'
        lang_enum:
          | 'English (US)'
          | 'English (UK)'
          | 'Spanish'
          | 'German'
          | 'French'
          | 'Italian'
          | 'Dutch'
          | 'Swedish'
          | 'Polish'
          | 'Portuguese (BR)'
        length_unit_enum: 'in' | 'm' | 'cm' | 'mm'
        marketplace_id_enum:
          | 'ATVPDKIKX0DER'
          | 'A1F83G8C2ARO7P'
          | 'A1PA6795UKMFR9'
          | 'A13V1IB3VIYZZH'
          | 'APJ6JRA9NG5V4'
          | 'A1RKKUPIHCS9HS'
          | 'A2EUQ1WTGCTBG2'
          | 'A39IBJ37TRP1C6'
          | 'A1AM78C64UM0Y8'
          | 'A1805IZSGTT6HS'
          | 'AMEN7PMS3EDWL'
          | 'A2NODRKZP88ZB9'
          | 'A1C3SOZRARQ6R3'
          | 'A2Q3Y263D00KWC'
        po_type_enum: 'B2B' | 'E-Commerce' | 'Mixed'
        port_of_origin_enum: 'Shenzhen'
        rounding_type_enum: 'tenth' | 'half' | 'whole'
        sales_channel_enum: 'B2B' | 'Amazon'
        shipmenttype_enum: 'B2B' | 'E-Commerce'
        shipping_mode_enum: 'Air' | 'Ocean'
        supplier_shipment_destination_enum: '3PL' | 'AWD' | 'FBA'
        translation_status_enum: 'To-Do' | 'In Progress' | 'In Review' | 'Completed'
        variation_theme_enum: 'Style' | 'Color'
        weight_unit_enum: 'oz' | 'lb' | 'g' | 'kg'
      }
      CompositeTypes: {
        address: {
          addressLine1: string | null
          addressLine2: string | null
          city: string | null
          stateOrProvindCode: string | null
          countryCode: Database['public']['Enums']['country_code_enum'] | null
          postalCode: string | null
        }
        box_configuration_param: {
          boxName: string | null
          master: boolean | null
        }
        break_even_calculation_inputs: {
          mouldCost: number | null
          designCost: number | null
          packagingCost: number | null
          tacos: number | null
          currency: Database['public']['Enums']['currency_code_enum'] | null
        }
        contact_details: {
          name: string | null
          phone: string | null
          email: string | null
        }
        inventory_transaction: {
          code: string | null
          date: string | null
          sku: string | null
          unitsPerBox: number | null
          inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
          warehouse: string | null
          stage: Database['public']['Enums']['inventory_stage_enum'] | null
          boxQty: number | null
          unitQty: number | null
          valueUsd: number | null
        }
        landed_cost: {
          date: string | null
          poShipmentCode: string | null
          shipmentType: Database['public']['Enums']['shipmenttype_enum'] | null
          inventoryRegion: Database['public']['Enums']['inventory_region_enum'] | null
          sku: string | null
          currency: Database['public']['Enums']['currency_code_enum'] | null
          incomingUnitQty: number | null
          incomingUnitLandedCost: number | null
          landedUnitQty: number | null
          landedUnitLandedCost: number | null
          averageLandedCost: number | null
          rowIndex: number | null
        }
        rounding: {
          shouldRound: boolean | null
          type: Database['public']['Enums']['rounding_type_enum'] | null
          digits: number | null
        }
      }
    }
    spapi: {
      Tables: {
        log: {
          Row: {
            archived: boolean
            created: string
            errorMessage: string | null
            id: number
            operation: string | null
            rawResponse: string | null
            region: Database['spapi']['Enums']['region_enum']
            request: Json
            rescheduleDate: string | null
            responseErrors: Json | null
            responseHeaders: Json | null
            responseStatusCode: number | null
            runId: string
            seller: string
            status: Database['spapi']['Enums']['log_status_enum']
            tokenBalance: number | null
          }
          Insert: {
            archived?: boolean
            created?: string
            errorMessage?: string | null
            id?: number
            operation?: string | null
            rawResponse?: string | null
            region: Database['spapi']['Enums']['region_enum']
            request: Json
            rescheduleDate?: string | null
            responseErrors?: Json | null
            responseHeaders?: Json | null
            responseStatusCode?: number | null
            runId: string
            seller: string
            status: Database['spapi']['Enums']['log_status_enum']
            tokenBalance?: number | null
          }
          Update: {
            archived?: boolean
            created?: string
            errorMessage?: string | null
            id?: number
            operation?: string | null
            rawResponse?: string | null
            region?: Database['spapi']['Enums']['region_enum']
            request?: Json
            rescheduleDate?: string | null
            responseErrors?: Json | null
            responseHeaders?: Json | null
            responseStatusCode?: number | null
            runId?: string
            seller?: string
            status?: Database['spapi']['Enums']['log_status_enum']
            tokenBalance?: number | null
          }
          Relationships: [
            {
              foreignKeyName: 'log_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        notificationSubscriptions: {
          Row: {
            archived: boolean
            created: string
            destinationId: string | null
            id: number
            notificationType: string
            refreshTokenId: number
            region: Database['spapi']['Enums']['region_enum']
            seller: string
            status: Database['spapi']['Enums']['status_enum']
            subscriptionId: string | null
          }
          Insert: {
            archived?: boolean
            created?: string
            destinationId?: string | null
            id?: number
            notificationType: string
            refreshTokenId: number
            region: Database['spapi']['Enums']['region_enum']
            seller: string
            status?: Database['spapi']['Enums']['status_enum']
            subscriptionId?: string | null
          }
          Update: {
            archived?: boolean
            created?: string
            destinationId?: string | null
            id?: number
            notificationType?: string
            refreshTokenId?: number
            region?: Database['spapi']['Enums']['region_enum']
            seller?: string
            status?: Database['spapi']['Enums']['status_enum']
            subscriptionId?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'notificationSubscriptions_refreshTokenId_fkey'
              columns: ['refreshTokenId']
              isOneToOne: false
              referencedRelation: 'decrypted_refreshTokens'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'notificationSubscriptions_refreshTokenId_fkey'
              columns: ['refreshTokenId']
              isOneToOne: false
              referencedRelation: 'refreshTokens'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'notificationSubscriptions_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        refreshTokens: {
          Row: {
            awd: boolean
            id: number
            isSpapiReady: boolean | null
            key_id: string
            marketplaces: Database['public']['Enums']['country_code_enum'][]
            merchantToken: string
            refreshToken: string
            region: Database['spapi']['Enums']['region_enum']
            seller: string
          }
          Insert: {
            awd?: boolean
            id?: number
            isSpapiReady?: boolean | null
            key_id?: string
            marketplaces?: Database['public']['Enums']['country_code_enum'][]
            merchantToken: string
            refreshToken: string
            region: Database['spapi']['Enums']['region_enum']
            seller: string
          }
          Update: {
            awd?: boolean
            id?: number
            isSpapiReady?: boolean | null
            key_id?: string
            marketplaces?: Database['public']['Enums']['country_code_enum'][]
            merchantToken?: string
            refreshToken?: string
            region?: Database['spapi']['Enums']['region_enum']
            seller?: string
          }
          Relationships: [
            {
              foreignKeyName: 'refreshTokens_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        scheduledReports: {
          Row: {
            archived: boolean
            created: string
            id: number
            marketplaces: Database['public']['Enums']['country_code_enum'][]
            nextReportCreationTime: string | null
            period: Database['spapi']['Enums']['report_period_enum']
            refreshTokenId: number
            region: Database['spapi']['Enums']['region_enum']
            reportOptions: Json | null
            reportScheduleId: string | null
            reportType: string
            seller: string
            status: Database['spapi']['Enums']['status_enum']
          }
          Insert: {
            archived?: boolean
            created?: string
            id?: number
            marketplaces?: Database['public']['Enums']['country_code_enum'][]
            nextReportCreationTime?: string | null
            period: Database['spapi']['Enums']['report_period_enum']
            refreshTokenId: number
            region: Database['spapi']['Enums']['region_enum']
            reportOptions?: Json | null
            reportScheduleId?: string | null
            reportType: string
            seller: string
            status?: Database['spapi']['Enums']['status_enum']
          }
          Update: {
            archived?: boolean
            created?: string
            id?: number
            marketplaces?: Database['public']['Enums']['country_code_enum'][]
            nextReportCreationTime?: string | null
            period?: Database['spapi']['Enums']['report_period_enum']
            refreshTokenId?: number
            region?: Database['spapi']['Enums']['region_enum']
            reportOptions?: Json | null
            reportScheduleId?: string | null
            reportType?: string
            seller?: string
            status?: Database['spapi']['Enums']['status_enum']
          }
          Relationships: [
            {
              foreignKeyName: 'scheduledReports_refreshTokenId_fkey'
              columns: ['refreshTokenId']
              isOneToOne: false
              referencedRelation: 'decrypted_refreshTokens'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scheduledReports_refreshTokenId_fkey'
              columns: ['refreshTokenId']
              isOneToOne: false
              referencedRelation: 'refreshTokens'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scheduledReports_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
      }
      Views: {
        decrypted_refreshTokens: {
          Row: {
            awd: boolean | null
            decrypted_refreshToken: string | null
            id: number | null
            isSpapiReady: boolean | null
            key_id: string | null
            marketplaces: Database['public']['Enums']['country_code_enum'][] | null
            merchantToken: string | null
            refreshToken: string | null
            region: Database['spapi']['Enums']['region_enum'] | null
            seller: string | null
          }
          Insert: {
            awd?: boolean | null
            decrypted_refreshToken?: never
            id?: number | null
            isSpapiReady?: boolean | null
            key_id?: string | null
            marketplaces?: Database['public']['Enums']['country_code_enum'][] | null
            merchantToken?: string | null
            refreshToken?: string | null
            region?: Database['spapi']['Enums']['region_enum'] | null
            seller?: string | null
          }
          Update: {
            awd?: boolean | null
            decrypted_refreshToken?: never
            id?: number | null
            isSpapiReady?: boolean | null
            key_id?: string | null
            marketplaces?: Database['public']['Enums']['country_code_enum'][] | null
            merchantToken?: string | null
            refreshToken?: string | null
            region?: Database['spapi']['Enums']['region_enum'] | null
            seller?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'refreshTokens_seller_fkey'
              columns: ['seller']
              isOneToOne: false
              referencedRelation: 'sellers'
              referencedColumns: ['name']
            }
          ]
        }
        sellers: {
          Row: {
            amazonShipmentCode: string | null
            archived: boolean | null
            awdShipmentsFolderId: string | null
            created: string | null
            fbaShipmentsFolderId: string | null
            id: number | null
            name: string | null
          }
          Insert: {
            amazonShipmentCode?: string | null
            archived?: boolean | null
            awdShipmentsFolderId?: string | null
            created?: string | null
            fbaShipmentsFolderId?: string | null
            id?: number | null
            name?: string | null
          }
          Update: {
            amazonShipmentCode?: string | null
            archived?: boolean | null
            awdShipmentsFolderId?: string | null
            created?: string | null
            fbaShipmentsFolderId?: string | null
            id?: number | null
            name?: string | null
          }
          Relationships: []
        }
      }
      Functions: {
        upsert_scheduled_reports: {
          Args: {
            seller_arg: string
            region_arg: Database['spapi']['Enums']['region_enum']
          }
          Returns: undefined
        }
      }
      Enums: {
        log_status_enum: 'Completed' | 'Failed' | 'Rescheduled'
        region_enum: 'NA' | 'EU' | 'AU'
        report_period_enum:
          | '5 minutes'
          | '15 minutes'
          | '30 minutes'
          | '1 hour'
          | '2 hours'
          | '4 hours'
          | '8 hours'
          | '12 hours'
          | '1 day'
          | '2 days'
          | '3 days'
          | '84 hours'
          | '7 days'
          | '14 days'
          | '15 days'
          | '18 days'
          | '30 days'
          | '1 month'
        status_enum: 'Pending' | 'Completed' | 'Failed'
      }
      CompositeTypes: {
        [_ in never]: never
      }
    }
    storage: {
      Tables: {
        buckets: {
          Row: {
            allowed_mime_types: string[] | null
            avif_autodetection: boolean | null
            created_at: string | null
            file_size_limit: number | null
            id: string
            name: string
            owner: string | null
            owner_id: string | null
            public: boolean | null
            updated_at: string | null
          }
          Insert: {
            allowed_mime_types?: string[] | null
            avif_autodetection?: boolean | null
            created_at?: string | null
            file_size_limit?: number | null
            id: string
            name: string
            owner?: string | null
            owner_id?: string | null
            public?: boolean | null
            updated_at?: string | null
          }
          Update: {
            allowed_mime_types?: string[] | null
            avif_autodetection?: boolean | null
            created_at?: string | null
            file_size_limit?: number | null
            id?: string
            name?: string
            owner?: string | null
            owner_id?: string | null
            public?: boolean | null
            updated_at?: string | null
          }
          Relationships: []
        }
        migrations: {
          Row: {
            executed_at: string | null
            hash: string
            id: number
            name: string
          }
          Insert: {
            executed_at?: string | null
            hash: string
            id: number
            name: string
          }
          Update: {
            executed_at?: string | null
            hash?: string
            id?: number
            name?: string
          }
          Relationships: []
        }
        objects: {
          Row: {
            bucket_id: string | null
            created_at: string | null
            id: string
            last_accessed_at: string | null
            metadata: Json | null
            name: string | null
            owner: string | null
            owner_id: string | null
            path_tokens: string[] | null
            updated_at: string | null
            user_metadata: Json | null
            version: string | null
          }
          Insert: {
            bucket_id?: string | null
            created_at?: string | null
            id?: string
            last_accessed_at?: string | null
            metadata?: Json | null
            name?: string | null
            owner?: string | null
            owner_id?: string | null
            path_tokens?: string[] | null
            updated_at?: string | null
            user_metadata?: Json | null
            version?: string | null
          }
          Update: {
            bucket_id?: string | null
            created_at?: string | null
            id?: string
            last_accessed_at?: string | null
            metadata?: Json | null
            name?: string | null
            owner?: string | null
            owner_id?: string | null
            path_tokens?: string[] | null
            updated_at?: string | null
            user_metadata?: Json | null
            version?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'objects_bucketId_fkey'
              columns: ['bucket_id']
              isOneToOne: false
              referencedRelation: 'buckets'
              referencedColumns: ['id']
            }
          ]
        }
        s3_multipart_uploads: {
          Row: {
            bucket_id: string
            created_at: string
            id: string
            in_progress_size: number
            key: string
            owner_id: string | null
            upload_signature: string
            user_metadata: Json | null
            version: string
          }
          Insert: {
            bucket_id: string
            created_at?: string
            id: string
            in_progress_size?: number
            key: string
            owner_id?: string | null
            upload_signature: string
            user_metadata?: Json | null
            version: string
          }
          Update: {
            bucket_id?: string
            created_at?: string
            id?: string
            in_progress_size?: number
            key?: string
            owner_id?: string | null
            upload_signature?: string
            user_metadata?: Json | null
            version?: string
          }
          Relationships: [
            {
              foreignKeyName: 's3_multipart_uploads_bucket_id_fkey'
              columns: ['bucket_id']
              isOneToOne: false
              referencedRelation: 'buckets'
              referencedColumns: ['id']
            }
          ]
        }
        s3_multipart_uploads_parts: {
          Row: {
            bucket_id: string
            created_at: string
            etag: string
            id: string
            key: string
            owner_id: string | null
            part_number: number
            size: number
            upload_id: string
            version: string
          }
          Insert: {
            bucket_id: string
            created_at?: string
            etag: string
            id?: string
            key: string
            owner_id?: string | null
            part_number: number
            size?: number
            upload_id: string
            version: string
          }
          Update: {
            bucket_id?: string
            created_at?: string
            etag?: string
            id?: string
            key?: string
            owner_id?: string | null
            part_number?: number
            size?: number
            upload_id?: string
            version?: string
          }
          Relationships: [
            {
              foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey'
              columns: ['bucket_id']
              isOneToOne: false
              referencedRelation: 'buckets'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey'
              columns: ['upload_id']
              isOneToOne: false
              referencedRelation: 's3_multipart_uploads'
              referencedColumns: ['id']
            }
          ]
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        can_insert_object: {
          Args: {
            bucketid: string
            name: string
            owner: string
            metadata: Json
          }
          Returns: undefined
        }
        extension: {
          Args: {
            name: string
          }
          Returns: string
        }
        filename: {
          Args: {
            name: string
          }
          Returns: string
        }
        foldername: {
          Args: {
            name: string
          }
          Returns: string[]
        }
        get_size_by_bucket: {
          Args: Record<PropertyKey, never>
          Returns: {
            size: number
            bucket_id: string
          }[]
        }
        list_multipart_uploads_with_delimiter: {
          Args: {
            bucket_id: string
            prefix_param: string
            delimiter_param: string
            max_keys?: number
            next_key_token?: string
            next_upload_token?: string
          }
          Returns: {
            key: string
            id: string
            created_at: string
          }[]
        }
        list_objects_with_delimiter: {
          Args: {
            bucket_id: string
            prefix_param: string
            delimiter_param: string
            max_keys?: number
            start_after?: string
            next_token?: string
          }
          Returns: {
            name: string
            id: string
            metadata: Json
            updated_at: string
          }[]
        }
        operation: {
          Args: Record<PropertyKey, never>
          Returns: string
        }
        search: {
          Args: {
            prefix: string
            bucketname: string
            limits?: number
            levels?: number
            offsets?: number
            search?: string
            sortcolumn?: string
            sortorder?: string
          }
          Returns: {
            name: string
            id: string
            updated_at: string
            created_at: string
            last_accessed_at: string
            metadata: Json
          }[]
        }
      }
      Enums: {
        [_ in never]: never
      }
      CompositeTypes: {
        [_ in never]: never
      }
    }
  }

  const postgrest = new PostgrestClient<Database>(REST_URL)
  // "NA" | "EU" | "AU"
  const region: string = 'NA'
  const { data } = await postgrest
    .schema('spapi')
    .from('refreshTokens')
    .select('seller, marketplaces, merchantToken, ...sellers(amazonShipmentCode)')
    .match({ region, isSpapiReady: true, awd: true })
  let result: Exclude<typeof data, null>
  let expected: {
    seller: string
    marketplaces: (
      | 'US'
      | 'GB'
      | 'CA'
      | 'AU'
      | 'DE'
      | 'FR'
      | 'IT'
      | 'ES'
      | 'MX'
      | 'NL'
      | 'BE'
      | 'SE'
      | 'PL'
      | 'BR'
    )[]
    merchantToken: string
    amazonShipmentCode: string | null
  }[]

  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// Test case https://github.com/supabase/postgrest-js/issues/568#issuecomment-2446129574
{
  type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

  type Database = {
    graphql_public: {
      Tables: {
        [_ in never]: never
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        graphql: {
          Args: {
            operationName?: string
            query?: string
            variables?: Json
            extensions?: Json
          }
          Returns: Json
        }
      }
      Enums: {
        [_ in never]: never
      }
      CompositeTypes: {
        [_ in never]: never
      }
    }
    public: {
      Tables: {
        asset: {
          Row: {
            created_at: string
            domain: string
            id: string
            is_active: boolean
            is_soft_deleted: boolean
            is_verified: boolean | null
            parent_asset_id: string | null
            paths: string[]
            ports: number[]
            tenant_id: string
            verification_method: Database['public']['Enums']['asset_verification_method'] | null
            verification_token: string
          }
          Insert: {
            created_at?: string
            domain: string
            id?: string
            is_active?: boolean
            is_soft_deleted?: boolean
            is_verified?: boolean | null
            parent_asset_id?: string | null
            paths?: string[]
            ports?: number[]
            tenant_id: string
            verification_method?: Database['public']['Enums']['asset_verification_method'] | null
            verification_token?: string
          }
          Update: {
            created_at?: string
            domain?: string
            id?: string
            is_active?: boolean
            is_soft_deleted?: boolean
            is_verified?: boolean | null
            parent_asset_id?: string | null
            paths?: string[]
            ports?: number[]
            tenant_id?: string
            verification_method?: Database['public']['Enums']['asset_verification_method'] | null
            verification_token?: string
          }
          Relationships: [
            {
              foreignKeyName: 'asset_parent_asset_id_fkey'
              columns: ['parent_asset_id']
              isOneToOne: false
              referencedRelation: 'asset'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'asset_parent_asset_id_fkey'
              columns: ['parent_asset_id']
              isOneToOne: false
              referencedRelation: 'latest_scan_of_asset'
              referencedColumns: ['asset_id']
            },
            {
              foreignKeyName: 'asset_tenant_id_fkey'
              columns: ['tenant_id']
              isOneToOne: false
              referencedRelation: 'tenant'
              referencedColumns: ['id']
            }
          ]
        }
        dashboard_notification: {
          Row: {
            created_at: string
            detail_de: string
            detail_en: string
            id: string
            notification_severity: Database['public']['Enums']['notification_severity']
            resolved_at: string | null
            started_at: string | null
            summary_de: string
            summary_en: string
          }
          Insert: {
            created_at?: string
            detail_de: string
            detail_en: string
            id?: string
            notification_severity: Database['public']['Enums']['notification_severity']
            resolved_at?: string | null
            started_at?: string | null
            summary_de: string
            summary_en: string
          }
          Update: {
            created_at?: string
            detail_de?: string
            detail_en?: string
            id?: string
            notification_severity?: Database['public']['Enums']['notification_severity']
            resolved_at?: string | null
            started_at?: string | null
            summary_de?: string
            summary_en?: string
          }
          Relationships: []
        }
        finding: {
          Row: {
            created_at: string
            cvss: string | null
            cvss_base_score: number | null
            cvss_exploitability_score: number | null
            cvss_impact_score: number | null
            cvss_vector: Json | null
            cwe: number[]
            finding_type: Database['public']['Enums']['finding_type']
            reference_urls: string[]
            severity: number
          }
          Insert: {
            created_at?: string
            cvss?: string | null
            cvss_base_score?: number | null
            cvss_exploitability_score?: number | null
            cvss_impact_score?: number | null
            cvss_vector?: Json | null
            cwe: number[]
            finding_type: Database['public']['Enums']['finding_type']
            reference_urls: string[]
            severity?: number
          }
          Update: {
            created_at?: string
            cvss?: string | null
            cvss_base_score?: number | null
            cvss_exploitability_score?: number | null
            cvss_impact_score?: number | null
            cvss_vector?: Json | null
            cwe?: number[]
            finding_type?: Database['public']['Enums']['finding_type']
            reference_urls?: string[]
            severity?: number
          }
          Relationships: []
        }
        finding_text: {
          Row: {
            created_at: string
            finding_type: Database['public']['Enums']['finding_type']
            id: string
            language_code: Database['public']['Enums']['language_code']
            value: Json
          }
          Insert: {
            created_at?: string
            finding_type: Database['public']['Enums']['finding_type']
            id?: string
            language_code: Database['public']['Enums']['language_code']
            value: Json
          }
          Update: {
            created_at?: string
            finding_type?: Database['public']['Enums']['finding_type']
            id?: string
            language_code?: Database['public']['Enums']['language_code']
            value?: Json
          }
          Relationships: [
            {
              foreignKeyName: 'finding_text_finding_type_fkey'
              columns: ['finding_type']
              isOneToOne: false
              referencedRelation: 'finding'
              referencedColumns: ['finding_type']
            }
          ]
        }
        fingerprint: {
          Row: {
            file_path: string
            md5: string
            product_id: string
            version: number
            version_string: string
          }
          Insert: {
            file_path: string
            md5: string
            product_id: string
            version?: number
            version_string: string
          }
          Update: {
            file_path?: string
            md5?: string
            product_id?: string
            version?: number
            version_string?: string
          }
          Relationships: [
            {
              foreignKeyName: 'fingerprint_product_id_fkey'
              columns: ['product_id']
              isOneToOne: false
              referencedRelation: 'product'
              referencedColumns: ['id']
            }
          ]
        }
        partner: {
          Row: {
            created_at: string
            id: string
            marketplace_id: string
            name: string
          }
          Insert: {
            created_at?: string
            id?: string
            marketplace_id: string
            name: string
          }
          Update: {
            created_at?: string
            id?: string
            marketplace_id?: string
            name?: string
          }
          Relationships: []
        }
        product: {
          Row: {
            cpe: string | null
            created_at: string
            icon: string | null
            id: string
            latest_versions: number[]
            latest_versions_string: string[]
            name: string | null
            product_parent_id: string | null
            product_specific_identifier: string | null
            product_status: Database['public']['Enums']['product_status']
            product_type: Database['public']['Enums']['product_type'] | null
            url: string | null
          }
          Insert: {
            cpe?: string | null
            created_at?: string
            icon?: string | null
            id: string
            latest_versions?: number[]
            latest_versions_string?: string[]
            name?: string | null
            product_parent_id?: string | null
            product_specific_identifier?: string | null
            product_status: Database['public']['Enums']['product_status']
            product_type?: Database['public']['Enums']['product_type'] | null
            url?: string | null
          }
          Update: {
            cpe?: string | null
            created_at?: string
            icon?: string | null
            id?: string
            latest_versions?: number[]
            latest_versions_string?: string[]
            name?: string | null
            product_parent_id?: string | null
            product_specific_identifier?: string | null
            product_status?: Database['public']['Enums']['product_status']
            product_type?: Database['public']['Enums']['product_type'] | null
            url?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'product_product_parent_id_fkey'
              columns: ['product_parent_id']
              isOneToOne: false
              referencedRelation: 'product'
              referencedColumns: ['id']
            }
          ]
        }
        product_has_vulnerability: {
          Row: {
            affected_version: unknown
            affected_version_strings: string[]
            created_at: string | null
            id: string
            product_id: string
            vulnerability_id: string
          }
          Insert: {
            affected_version?: unknown
            affected_version_strings: string[]
            created_at?: string | null
            id?: string
            product_id: string
            vulnerability_id: string
          }
          Update: {
            affected_version?: unknown
            affected_version_strings?: string[]
            created_at?: string | null
            id?: string
            product_id?: string
            vulnerability_id?: string
          }
          Relationships: [
            {
              foreignKeyName: 'product_has_vulnerability_product_id_fkey'
              columns: ['product_id']
              isOneToOne: false
              referencedRelation: 'product'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'product_has_vulnerability_vulnerability_id_fkey'
              columns: ['vulnerability_id']
              isOneToOne: false
              referencedRelation: 'vulnerability'
              referencedColumns: ['id']
            }
          ]
        }
        queue_task: {
          Row: {
            created_at: string
            finished_at: string | null
            id: string
            next_queue_task_id: string | null
            queue_type: Database['public']['Enums']['queue_type']
            started_at: string | null
            task_configuration: Json | null
            task_priority: Database['public']['Enums']['task_priority']
            task_result: Json | null
            task_status: Database['public']['Enums']['task_status']
            task_type: Database['public']['Enums']['task_type']
            user_id: string | null
          }
          Insert: {
            created_at?: string
            finished_at?: string | null
            id?: string
            next_queue_task_id?: string | null
            queue_type: Database['public']['Enums']['queue_type']
            started_at?: string | null
            task_configuration?: Json | null
            task_priority: Database['public']['Enums']['task_priority']
            task_result?: Json | null
            task_status?: Database['public']['Enums']['task_status']
            task_type: Database['public']['Enums']['task_type']
            user_id?: string | null
          }
          Update: {
            created_at?: string
            finished_at?: string | null
            id?: string
            next_queue_task_id?: string | null
            queue_type?: Database['public']['Enums']['queue_type']
            started_at?: string | null
            task_configuration?: Json | null
            task_priority?: Database['public']['Enums']['task_priority']
            task_result?: Json | null
            task_status?: Database['public']['Enums']['task_status']
            task_type?: Database['public']['Enums']['task_type']
            user_id?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'queue_task_next_queue_task_id_fkey'
              columns: ['next_queue_task_id']
              isOneToOne: false
              referencedRelation: 'queue_task'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'queue_task_next_queue_task_id_fkey'
              columns: ['next_queue_task_id']
              isOneToOne: false
              referencedRelation: 'report_queue_task'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'queue_task_user_id_fkey'
              columns: ['user_id']
              isOneToOne: false
              referencedRelation: 'user_profile'
              referencedColumns: ['user_id']
            }
          ]
        }
        scan: {
          Row: {
            created_at: string
            created_at_date: string
            finished_at: string | null
            id: string
            is_report_sent: boolean | null
            is_soft_deleted: boolean
            maximum_cvss_base_score: number | null
            maximum_severity: number
            priority: number
            scan_configuration_id: string
            started_at: string | null
            tenant_id: string
          }
          Insert: {
            created_at?: string
            created_at_date?: string
            finished_at?: string | null
            id?: string
            is_report_sent?: boolean | null
            is_soft_deleted?: boolean
            maximum_cvss_base_score?: number | null
            maximum_severity?: number
            priority?: number
            scan_configuration_id: string
            started_at?: string | null
            tenant_id: string
          }
          Update: {
            created_at?: string
            created_at_date?: string
            finished_at?: string | null
            id?: string
            is_report_sent?: boolean | null
            is_soft_deleted?: boolean
            maximum_cvss_base_score?: number | null
            maximum_severity?: number
            priority?: number
            scan_configuration_id?: string
            started_at?: string | null
            tenant_id?: string
          }
          Relationships: [
            {
              foreignKeyName: 'scan_scan_configuration_id_fkey'
              columns: ['scan_configuration_id']
              isOneToOne: false
              referencedRelation: 'scan_configuration'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scan_tenant_id_fkey'
              columns: ['tenant_id']
              isOneToOne: false
              referencedRelation: 'tenant'
              referencedColumns: ['id']
            }
          ]
        }
        scan_configuration: {
          Row: {
            asset_id: string
            created_at: string
            frequency: Database['public']['Enums']['scan_configuration_frequency']
            id: string
            is_active: boolean
            is_soft_deleted: boolean
            next_scan_at: string | null
            scan_type: Database['public']['Enums']['scan_configuration_scan_type']
            tenant_id: string
            title: string
          }
          Insert: {
            asset_id: string
            created_at?: string
            frequency: Database['public']['Enums']['scan_configuration_frequency']
            id?: string
            is_active?: boolean
            is_soft_deleted?: boolean
            next_scan_at?: string | null
            scan_type: Database['public']['Enums']['scan_configuration_scan_type']
            tenant_id: string
            title?: string
          }
          Update: {
            asset_id?: string
            created_at?: string
            frequency?: Database['public']['Enums']['scan_configuration_frequency']
            id?: string
            is_active?: boolean
            is_soft_deleted?: boolean
            next_scan_at?: string | null
            scan_type?: Database['public']['Enums']['scan_configuration_scan_type']
            tenant_id?: string
            title?: string
          }
          Relationships: [
            {
              foreignKeyName: 'scan_configuration_asset_id_fkey'
              columns: ['asset_id']
              isOneToOne: false
              referencedRelation: 'asset'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scan_configuration_asset_id_fkey'
              columns: ['asset_id']
              isOneToOne: false
              referencedRelation: 'latest_scan_of_asset'
              referencedColumns: ['asset_id']
            },
            {
              foreignKeyName: 'scan_configuration_tenant_id_fkey'
              columns: ['tenant_id']
              isOneToOne: false
              referencedRelation: 'tenant'
              referencedColumns: ['id']
            }
          ]
        }
        scantask: {
          Row: {
            capability: Database['public']['Enums']['worker_capability']
            created_at: string | null
            failed_at: string | null
            finished_at: string | null
            id: string
            is_soft_deleted: boolean
            port: number | null
            retry_counter: number
            scan_id: string
            started_at: string | null
            tenant_id: string
            worker_type: string
          }
          Insert: {
            capability: Database['public']['Enums']['worker_capability']
            created_at?: string | null
            failed_at?: string | null
            finished_at?: string | null
            id?: string
            is_soft_deleted?: boolean
            port?: number | null
            retry_counter?: number
            scan_id: string
            started_at?: string | null
            tenant_id: string
            worker_type: string
          }
          Update: {
            capability?: Database['public']['Enums']['worker_capability']
            created_at?: string | null
            failed_at?: string | null
            finished_at?: string | null
            id?: string
            is_soft_deleted?: boolean
            port?: number | null
            retry_counter?: number
            scan_id?: string
            started_at?: string | null
            tenant_id?: string
            worker_type?: string
          }
          Relationships: [
            {
              foreignKeyName: 'scantask_scan_id_fkey'
              columns: ['scan_id']
              isOneToOne: false
              referencedRelation: 'latest_scan_of_asset'
              referencedColumns: ['scan_id']
            },
            {
              foreignKeyName: 'scantask_scan_id_fkey'
              columns: ['scan_id']
              isOneToOne: false
              referencedRelation: 'scan'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scantask_tenant_id_fkey'
              columns: ['tenant_id']
              isOneToOne: false
              referencedRelation: 'tenant'
              referencedColumns: ['id']
            }
          ]
        }
        scantask_found_finding: {
          Row: {
            created_at: string
            finding_type: Database['public']['Enums']['finding_type']
            id: string
            is_soft_deleted: boolean
            path: string | null
            port: number
            product_id: string | null
            scan_id: string
            scantask_id: string
            tenant_id: string
            value: Json
            value_hash: string
          }
          Insert: {
            created_at?: string
            finding_type: Database['public']['Enums']['finding_type']
            id?: string
            is_soft_deleted?: boolean
            path?: string | null
            port: number
            product_id?: string | null
            scan_id: string
            scantask_id: string
            tenant_id: string
            value: Json
            value_hash?: string
          }
          Update: {
            created_at?: string
            finding_type?: Database['public']['Enums']['finding_type']
            id?: string
            is_soft_deleted?: boolean
            path?: string | null
            port?: number
            product_id?: string | null
            scan_id?: string
            scantask_id?: string
            tenant_id?: string
            value?: Json
            value_hash?: string
          }
          Relationships: [
            {
              foreignKeyName: 'scantask_found_finding_finding_type_fkey'
              columns: ['finding_type']
              isOneToOne: false
              referencedRelation: 'finding'
              referencedColumns: ['finding_type']
            },
            {
              foreignKeyName: 'scantask_found_finding_product_id_fkey'
              columns: ['product_id']
              isOneToOne: false
              referencedRelation: 'product'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scantask_found_finding_scan_id_fkey'
              columns: ['scan_id']
              isOneToOne: false
              referencedRelation: 'latest_scan_of_asset'
              referencedColumns: ['scan_id']
            },
            {
              foreignKeyName: 'scantask_found_finding_scan_id_fkey'
              columns: ['scan_id']
              isOneToOne: false
              referencedRelation: 'scan'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scantask_found_finding_scantask_id_fkey'
              columns: ['scantask_id']
              isOneToOne: false
              referencedRelation: 'scantask'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scantask_found_finding_tenant_id_fkey'
              columns: ['tenant_id']
              isOneToOne: false
              referencedRelation: 'tenant'
              referencedColumns: ['id']
            }
          ]
        }
        scantask_found_information: {
          Row: {
            created_at: string
            id: string
            information_subtype: Database['public']['Enums']['information_subtype'] | null
            information_type: Database['public']['Enums']['information_type']
            is_soft_deleted: boolean
            path: string | null
            port: number | null
            product_id: string | null
            scan_id: string
            scantask_id: string
            tenant_id: string
            value: Json
            value_hash: string
          }
          Insert: {
            created_at?: string
            id?: string
            information_subtype?: Database['public']['Enums']['information_subtype'] | null
            information_type: Database['public']['Enums']['information_type']
            is_soft_deleted?: boolean
            path?: string | null
            port?: number | null
            product_id?: string | null
            scan_id: string
            scantask_id: string
            tenant_id: string
            value: Json
            value_hash?: string
          }
          Update: {
            created_at?: string
            id?: string
            information_subtype?: Database['public']['Enums']['information_subtype'] | null
            information_type?: Database['public']['Enums']['information_type']
            is_soft_deleted?: boolean
            path?: string | null
            port?: number | null
            product_id?: string | null
            scan_id?: string
            scantask_id?: string
            tenant_id?: string
            value?: Json
            value_hash?: string
          }
          Relationships: [
            {
              foreignKeyName: 'scantask_found_information_product_id_fkey'
              columns: ['product_id']
              isOneToOne: false
              referencedRelation: 'product'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scantask_found_information_scan_id_fkey'
              columns: ['scan_id']
              isOneToOne: false
              referencedRelation: 'latest_scan_of_asset'
              referencedColumns: ['scan_id']
            },
            {
              foreignKeyName: 'scantask_found_information_scan_id_fkey'
              columns: ['scan_id']
              isOneToOne: false
              referencedRelation: 'scan'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scantask_found_information_scantask_id_fkey'
              columns: ['scantask_id']
              isOneToOne: false
              referencedRelation: 'scantask'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scantask_found_information_tenant_id_fkey'
              columns: ['tenant_id']
              isOneToOne: false
              referencedRelation: 'tenant'
              referencedColumns: ['id']
            }
          ]
        }
        scantask_found_vulnerability: {
          Row: {
            created_at: string
            id: string
            is_soft_deleted: boolean
            path: string | null
            port: number
            product_has_vulnerability_id: string
            scan_id: string
            scantask_id: string
            tenant_id: string
          }
          Insert: {
            created_at?: string
            id?: string
            is_soft_deleted?: boolean
            path?: string | null
            port: number
            product_has_vulnerability_id: string
            scan_id: string
            scantask_id: string
            tenant_id: string
          }
          Update: {
            created_at?: string
            id?: string
            is_soft_deleted?: boolean
            path?: string | null
            port?: number
            product_has_vulnerability_id?: string
            scan_id?: string
            scantask_id?: string
            tenant_id?: string
          }
          Relationships: [
            {
              foreignKeyName: 'scantask_found_vulnerability_product_has_vulnerability_id_fkey'
              columns: ['product_has_vulnerability_id']
              isOneToOne: false
              referencedRelation: 'product_has_vulnerability'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scantask_found_vulnerability_scan_id_fkey'
              columns: ['scan_id']
              isOneToOne: false
              referencedRelation: 'latest_scan_of_asset'
              referencedColumns: ['scan_id']
            },
            {
              foreignKeyName: 'scantask_found_vulnerability_scan_id_fkey'
              columns: ['scan_id']
              isOneToOne: false
              referencedRelation: 'scan'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scantask_found_vulnerability_scantask_id_fkey'
              columns: ['scantask_id']
              isOneToOne: false
              referencedRelation: 'scantask'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 'scantask_found_vulnerability_tenant_id_fkey'
              columns: ['tenant_id']
              isOneToOne: false
              referencedRelation: 'tenant'
              referencedColumns: ['id']
            }
          ]
        }
        subscription: {
          Row: {
            customer_id: string | null
            is_subscribed: boolean
            tenant_id: string
            tier: Database['public']['Enums']['subscription_tier_name']
          }
          Insert: {
            customer_id?: string | null
            is_subscribed?: boolean
            tenant_id: string
            tier?: Database['public']['Enums']['subscription_tier_name']
          }
          Update: {
            customer_id?: string | null
            is_subscribed?: boolean
            tenant_id?: string
            tier?: Database['public']['Enums']['subscription_tier_name']
          }
          Relationships: [
            {
              foreignKeyName: 'subscription_tenant_id_fkey'
              columns: ['tenant_id']
              isOneToOne: true
              referencedRelation: 'tenant'
              referencedColumns: ['id']
            }
          ]
        }
        tenant: {
          Row: {
            city: string | null
            created_at: string
            email_address: string | null
            house_number: string | null
            id: string
            marketplace_id: string | null
            name: string | null
            partner_id: string | null
            phone_number: string | null
            postcode: string | null
            street: string | null
            website: string | null
          }
          Insert: {
            city?: string | null
            created_at?: string
            email_address?: string | null
            house_number?: string | null
            id?: string
            marketplace_id?: string | null
            name?: string | null
            partner_id?: string | null
            phone_number?: string | null
            postcode?: string | null
            street?: string | null
            website?: string | null
          }
          Update: {
            city?: string | null
            created_at?: string
            email_address?: string | null
            house_number?: string | null
            id?: string
            marketplace_id?: string | null
            name?: string | null
            partner_id?: string | null
            phone_number?: string | null
            postcode?: string | null
            street?: string | null
            website?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'tenant_partner_id_fkey'
              columns: ['partner_id']
              isOneToOne: false
              referencedRelation: 'partner'
              referencedColumns: ['id']
            }
          ]
        }
        user_data: {
          Row: {
            available_sales_script_count: number
            created_at: string | null
            total_sales_script_count: number
            user_id: string
          }
          Insert: {
            available_sales_script_count?: number
            created_at?: string | null
            total_sales_script_count?: number
            user_id: string
          }
          Update: {
            available_sales_script_count?: number
            created_at?: string | null
            total_sales_script_count?: number
            user_id?: string
          }
          Relationships: [
            {
              foreignKeyName: 'user_data_user_id_fkey'
              columns: ['user_id']
              isOneToOne: true
              referencedRelation: 'user_profile'
              referencedColumns: ['user_id']
            }
          ]
        }
        user_profile: {
          Row: {
            created_at: string | null
            email_address: string | null
            first_name: string | null
            language_code: Database['public']['Enums']['language_code']
            last_name: string | null
            tenant_id: string
            user_id: string
          }
          Insert: {
            created_at?: string | null
            email_address?: string | null
            first_name?: string | null
            language_code?: Database['public']['Enums']['language_code']
            last_name?: string | null
            tenant_id: string
            user_id: string
          }
          Update: {
            created_at?: string | null
            email_address?: string | null
            first_name?: string | null
            language_code?: Database['public']['Enums']['language_code']
            last_name?: string | null
            tenant_id?: string
            user_id?: string
          }
          Relationships: [
            {
              foreignKeyName: 'user_profile_tenant_id_fkey'
              columns: ['tenant_id']
              isOneToOne: false
              referencedRelation: 'tenant'
              referencedColumns: ['id']
            }
          ]
        }
        user_roles: {
          Row: {
            roles: Database['public']['Enums']['user_role'][]
            user_id: string
          }
          Insert: {
            roles: Database['public']['Enums']['user_role'][]
            user_id: string
          }
          Update: {
            roles?: Database['public']['Enums']['user_role'][]
            user_id?: string
          }
          Relationships: [
            {
              foreignKeyName: 'user_roles_user_id_fkey'
              columns: ['user_id']
              isOneToOne: true
              referencedRelation: 'user_profile'
              referencedColumns: ['user_id']
            }
          ]
        }
        vulnerability: {
          Row: {
            created_at: string
            cvss: string
            cvss_base_score: number | null
            cvss_exploitability_score: number | null
            cvss_impact_score: number | null
            cvss_vector: Json | null
            cwe: number[]
            descriptions: string[]
            epss: number | null
            id: string
            identifier: string
            reference_urls: string[]
            severity: number
          }
          Insert: {
            created_at?: string
            cvss: string
            cvss_base_score?: number | null
            cvss_exploitability_score?: number | null
            cvss_impact_score?: number | null
            cvss_vector?: Json | null
            cwe: number[]
            descriptions: string[]
            epss?: number | null
            id?: string
            identifier: string
            reference_urls: string[]
            severity?: number
          }
          Update: {
            created_at?: string
            cvss?: string
            cvss_base_score?: number | null
            cvss_exploitability_score?: number | null
            cvss_impact_score?: number | null
            cvss_vector?: Json | null
            cwe?: number[]
            descriptions?: string[]
            epss?: number | null
            id?: string
            identifier?: string
            reference_urls?: string[]
            severity?: number
          }
          Relationships: []
        }
        vulnerability_source: {
          Row: {
            affected_version: unknown
            affected_version_strings: string[]
            created_at: string
            cvss: string | null
            cwe: number[]
            description: string | null
            epss: number | null
            id: string
            identifiers: string[]
            parser: Database['public']['Enums']['vulnerability_parser']
            product_id: string | null
            reference_urls: string[]
            url: string
          }
          Insert: {
            affected_version?: unknown
            affected_version_strings: string[]
            created_at?: string
            cvss?: string | null
            cwe: number[]
            description?: string | null
            epss?: number | null
            id?: string
            identifiers: string[]
            parser: Database['public']['Enums']['vulnerability_parser']
            product_id?: string | null
            reference_urls: string[]
            url: string
          }
          Update: {
            affected_version?: unknown
            affected_version_strings?: string[]
            created_at?: string
            cvss?: string | null
            cwe?: number[]
            description?: string | null
            epss?: number | null
            id?: string
            identifiers?: string[]
            parser?: Database['public']['Enums']['vulnerability_parser']
            product_id?: string | null
            reference_urls?: string[]
            url?: string
          }
          Relationships: [
            {
              foreignKeyName: 'vulnerability_source_product_id_fkey'
              columns: ['product_id']
              isOneToOne: false
              referencedRelation: 'product'
              referencedColumns: ['id']
            }
          ]
        }
        vulnerability_text: {
          Row: {
            created_at: string | null
            id: string
            language_code: Database['public']['Enums']['language_code']
            value: Json
            vulnerability_id: string
          }
          Insert: {
            created_at?: string | null
            id?: string
            language_code: Database['public']['Enums']['language_code']
            value: Json
            vulnerability_id: string
          }
          Update: {
            created_at?: string | null
            id?: string
            language_code?: Database['public']['Enums']['language_code']
            value?: Json
            vulnerability_id?: string
          }
          Relationships: [
            {
              foreignKeyName: 'vulnerability_text_vulnerability_id_fkey'
              columns: ['vulnerability_id']
              isOneToOne: false
              referencedRelation: 'vulnerability'
              referencedColumns: ['id']
            }
          ]
        }
      }
      Views: {
        distinct_fingerprint_file_paths: {
          Row: {
            amount: number | null
            file_path: string | null
            product_id: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'fingerprint_product_id_fkey'
              columns: ['product_id']
              isOneToOne: false
              referencedRelation: 'product'
              referencedColumns: ['id']
            }
          ]
        }
        latest_finding_and_vulnerability: {
          Row: {
            asset_domain: string[] | null
            asset_id: string[] | null
            created_at: string[] | null
            cvss_base_score: number | null
            cvss_exploitability_score: number | null
            cvss_impact_score: number | null
            finding_type: Database['public']['Enums']['finding_type'] | null
            finished_at: string[] | null
            path: string[] | null
            placeholder_hash: string | null
            placeholder_values: Json | null
            port: number[] | null
            product_id: string | null
            scan_configuration_id: string[] | null
            scan_configuration_title: string[] | null
            scan_id: string[] | null
            scantask_id: string | null
            severity: number | null
            started_at: string[] | null
            vulnerability_id: string | null
          }
          Relationships: []
        }
        latest_scan_of_asset: {
          Row: {
            asset_id: string | null
            scan_id: string | null
          }
          Relationships: []
        }
        report_queue_task: {
          Row: {
            domain: string | null
            id: string | null
            paths: string[] | null
            ports: number[] | null
            queue_type: Database['public']['Enums']['queue_type'] | null
            task_configuration: Json | null
            task_status: Database['public']['Enums']['task_status'] | null
            task_type: Database['public']['Enums']['task_type'] | null
            user_id: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'queue_task_user_id_fkey'
              columns: ['user_id']
              isOneToOne: false
              referencedRelation: 'user_profile'
              referencedColumns: ['user_id']
            }
          ]
        }
      }
      Functions: {
        can_tenant_insert_more_assets: {
          Args: {
            p_tenant_id: string
          }
          Returns: boolean
        }
        can_tenant_insert_more_daily_scans: {
          Args: {
            p_tenant_id: string
          }
          Returns: boolean
        }
        can_tenant_insert_more_scans: {
          Args: {
            p_tenant_id: string
          }
          Returns: boolean
        }
        collect_tenants_statistics: {
          Args: Record<PropertyKey, never>
          Returns: Json
        }
        count_assets_of_tenant: {
          Args: {
            p_tenant_id: string
          }
          Returns: number
        }
        count_daily_scans_of_tenant: {
          Args: {
            p_tenant_id: string
          }
          Returns: number
        }
        count_scans_of_tenant: {
          Args: {
            p_tenant_id: string
          }
          Returns: number
        }
        decrement_available_sales_script_count: {
          Args: {
            user_id_arg: string
          }
          Returns: undefined
        }
        find_next_worker_task: {
          Args: {
            worker_type_arg: string
          }
          Returns: Database['public']['CompositeTypes']['worker_task']
        }
        finding_text: {
          Args: {
            '': unknown
          }
          Returns: {
            created_at: string
            finding_type: Database['public']['Enums']['finding_type']
            id: string
            language_code: Database['public']['Enums']['language_code']
            value: Json
          }[]
        }
        get_my_subscription_info: {
          Args: Record<PropertyKey, never>
          Returns: Database['public']['CompositeTypes']['subscription_info']
        }
        get_my_subscription_info_with_current_counts: {
          Args: Record<PropertyKey, never>
          Returns: Database['public']['CompositeTypes']['subscription_info_with_current_counts']
        }
        get_subscription_info_of_tenant: {
          Args: {
            p_tenant_id: string
          }
          Returns: Database['public']['CompositeTypes']['subscription_info']
        }
        get_subscription_info_with_current_counts_of_tenant: {
          Args: {
            p_tenant_id: string
          }
          Returns: Database['public']['CompositeTypes']['subscription_info_with_current_counts']
        }
        product: {
          Args: {
            '': unknown
          }
          Returns: {
            cpe: string | null
            created_at: string
            icon: string | null
            id: string
            latest_versions: number[]
            latest_versions_string: string[]
            name: string | null
            product_parent_id: string | null
            product_specific_identifier: string | null
            product_status: Database['public']['Enums']['product_status']
            product_type: Database['public']['Enums']['product_type'] | null
            url: string | null
          }[]
        }
        vulnerability_text: {
          Args: {
            '': unknown
          }
          Returns: {
            created_at: string | null
            id: string
            language_code: Database['public']['Enums']['language_code']
            value: Json
            vulnerability_id: string
          }[]
        }
      }
      Enums: {
        asset_verification_method:
          | 'automatic_asset_verification_permission'
          | 'automatic_domain_from_email_address'
          | 'automatic_email_address_from_website'
          | 'automatic_subdomain_of_verified_domain'
          | 'manual_email_address_from_website_imprint'
          | 'manual_dns_txt_record'
          | 'manual_file_upload'
          | 'manual_meta_tag'
        asset_verification_result:
          | 'success'
          | 'failed_to_fetch_website'
          | 'unsuccessful_response_from_website'
          | 'empty_website'
          | 'failed_to_resolve_dns'
          | 'no_dns_records'
          | 'no_dns_record_with_correct_attribute'
          | 'no_dns_record_with_correct_value'
          | 'failed_to_fetch_file'
          | 'unsuccessful_response_from_file'
          | 'empty_file'
          | 'file_with_incorrect_content'
          | 'failed_to_parse_html'
          | 'no_meta_tags'
          | 'no_meta_tag_with_correct_name'
          | 'no_meta_tag_with_correct_content'
          | 'failed_to_find_email_address'
          | 'failed_to_find_imprint_url'
        finding_type:
          | 'dsa'
          | 'weak_rsa'
          | 'ssl_medium_strength'
          | 'ssl_weak_strength'
          | 'referrer_unsafe'
          | 'referrer_invalid'
          | 'hsts_invalid'
          | 'hsts_less_six_months'
          | 'hsts_missing'
          | 'sri_impl_no_https'
          | 'sri_not_impl_no_https'
          | 'x_cto_invalid'
          | 'x_cto_missing'
          | 'x_fo_invalid'
          | 'x_fo_missing'
          | 'x_xss_protection_invalid'
          | 'csp_unsafe_eval'
          | 'csp_insecure_scheme'
          | 'csp_unsafe_inline'
          | 'csp_invalid'
          | 'csp_missing'
          | 'cors'
          | 'cookie_no_secure'
          | 'cookie_samesite_invalid'
          | 'cookie_csrf_no_samesite'
          | 'cookie_session_no_httponly'
          | 'unsafe_http'
          | 'file_leak'
          | 'ssl_error'
          | 'users'
          | 'anonymous_access'
          | 'exposed_git_directory'
        information_subtype:
          | 'a_record'
          | 'aaaa_record'
          | 'cname_record'
          | 'mx_record'
          | 'ns_record'
          | 'soa_record'
          | 'txt_record'
          | 'no_robots_txt'
          | 'robots_txt'
          | 'no_security_txt'
          | 'security_txt'
          | 'no_sitemap_xml'
          | 'sitemap_xml'
          | 'bom_in_file'
          | 'data_after_sig'
          | 'empty_key'
          | 'empty_value'
          | 'expired'
          | 'invalid_cert'
          | 'invalid_charset'
          | 'invalid_expiry'
          | 'invalid_lang'
          | 'invalid_line'
          | 'invalid_media'
          | 'invalid_uri_scheme'
          | 'location'
          | 'long_expiry'
          | 'multi_expire'
          | 'multi_lang'
          | 'multiple_csaf_fields'
          | 'no_canonical'
          | 'no_canonical_match'
          | 'no_contact'
          | 'no_content_type'
          | 'no_csaf_file'
          | 'no_encryption'
          | 'no_expire'
          | 'no_https'
          | 'no_line_separators'
          | 'no_space'
          | 'no_uri'
          | 'not_signed'
          | 'pgp_data_error'
          | 'pgp_error'
          | 'prec_ws'
          | 'signed_format_issue'
          | 'unknown_field'
          | 'utf8'
          | 'parse_error'
        information_type:
          | 'certificate'
          | 'dns'
          | 'http_response_header'
          | 'http_response_status_code'
          | 'open_port'
          | 'robots_txt'
          | 'security_txt'
          | 'sitemap_xml'
          | 'status'
          | 'version'
        language_code: 'en' | 'de'
        notification_severity: 'success' | 'info' | 'warn' | 'error'
        permission_action: 'manage' | 'create' | 'read' | 'update' | 'delete'
        product_status: 'maintained' | 'unmaintained'
        product_type: 'extension' | 'plugin' | 'theme'
        queue_type: 'report' | 'open_ai' | 'email'
        report_type: 'executive' | 'technical'
        scan_configuration_frequency: 'monthly' | 'weekly' | 'daily' | 'once'
        scan_configuration_scan_type: 'default' | 'professional'
        subscription_tier_name:
          | 'Starter'
          | 'Sales'
          | 'Full Access'
          | 'Professional Basic'
          | 'Professional Plus'
          | 'Premium'
          | 'Enterprise'
        task_priority: 'high' | 'medium' | 'low'
        task_status: 'enqueued' | 'in_progress' | 'completed' | 'failed'
        task_type:
          | 'generate_sales_script'
          | 'generate_text_for_vulnerability'
          | 'download_pdf_report'
          | 'send_email_with_pdf_report'
          | 'send_finished_scan_report_email'
          | 'send_weekly_report_email'
          | 'send_reset_password_email'
          | 'send_change_email_address_current_email_address_email'
          | 'send_change_email_address_new_email_address_email'
          | 'send_marketplace_recovery_email'
          | 'send_subscription_cancelled_email'
          | 'send_subscription_updated_email'
          | 'send_new_tenant_from_marketplace_email'
          | 'send_tenant_invitation_email'
          | 'send_member_invitation_email'
        tenant_permission_subject: 'sales_script' | 'automatic_asset_verification'
        user_permission_subject:
          | 'all'
          | 'all_notifications'
          | 'own_tenant'
          | 'all_tenants'
          | 'beta_feature'
          | 'all_partners'
        user_role: 'member' | 'tenant_admin' | 'super_admin' | 'beta_tester'
        vulnerability_parser: 'drupal' | 'wordfence' | 'nist' | 'typo3' | 'contao_sa'
        worker_capability:
          | 'portscan'
          | 'http'
          | 'ssh'
          | 'ftp'
          | 'smtp'
          | 'pop3'
          | 'imap'
          | 'mysql'
          | 'sftp'
          | 'postgres'
          | 'dns'
      }
      CompositeTypes: {
        subscription_info: {
          is_subscribed: boolean | null
          has_customer_id: boolean | null
          subscription_tier_name: Database['public']['Enums']['subscription_tier_name'] | null
          max_asset_count: number | null
          max_scan_count: number | null
          max_daily_scan_count: number | null
          available_scan_frequencies:
            | Database['public']['Enums']['scan_configuration_frequency'][]
            | null
        }
        subscription_info_with_current_counts: {
          is_subscribed: boolean | null
          has_customer_id: boolean | null
          subscription_tier_name: Database['public']['Enums']['subscription_tier_name'] | null
          max_asset_count: number | null
          max_scan_count: number | null
          max_daily_scan_count: number | null
          available_scan_frequencies:
            | Database['public']['Enums']['scan_configuration_frequency'][]
            | null
          asset_count: number | null
          scan_count: number | null
          daily_scan_count: number | null
        }
        worker_task: {
          task_id: string | null
          scan_id: string | null
          tenant_id: string | null
          domain: string | null
          port: number | null
          all_ports: number[] | null
          paths: string[] | null
        }
      }
    }
    smart_lens_config: {
      Tables: {
        permission: {
          Row: {
            action: Database['public']['Enums']['permission_action']
            role: Database['public']['Enums']['user_role']
            subject: Database['public']['Enums']['user_permission_subject']
          }
          Insert: {
            action: Database['public']['Enums']['permission_action']
            role: Database['public']['Enums']['user_role']
            subject: Database['public']['Enums']['user_permission_subject']
          }
          Update: {
            action?: Database['public']['Enums']['permission_action']
            role?: Database['public']['Enums']['user_role']
            subject?: Database['public']['Enums']['user_permission_subject']
          }
          Relationships: []
        }
        subscription_permission: {
          Row: {
            action: Database['public']['Enums']['permission_action']
            subject: Database['public']['Enums']['tenant_permission_subject']
            subscription_tier_name: Database['public']['Enums']['subscription_tier_name']
          }
          Insert: {
            action: Database['public']['Enums']['permission_action']
            subject: Database['public']['Enums']['tenant_permission_subject']
            subscription_tier_name: Database['public']['Enums']['subscription_tier_name']
          }
          Update: {
            action?: Database['public']['Enums']['permission_action']
            subject?: Database['public']['Enums']['tenant_permission_subject']
            subscription_tier_name?: Database['public']['Enums']['subscription_tier_name']
          }
          Relationships: []
        }
        subscription_tier: {
          Row: {
            available_scan_frequencies: Database['public']['Enums']['scan_configuration_frequency'][]
            max_asset_count: number | null
            max_daily_scan_count: number | null
            max_scan_count: number | null
            name: Database['public']['Enums']['subscription_tier_name']
            scan_priority: number
          }
          Insert: {
            available_scan_frequencies: Database['public']['Enums']['scan_configuration_frequency'][]
            max_asset_count?: number | null
            max_daily_scan_count?: number | null
            max_scan_count?: number | null
            name: Database['public']['Enums']['subscription_tier_name']
            scan_priority?: number
          }
          Update: {
            available_scan_frequencies?: Database['public']['Enums']['scan_configuration_frequency'][]
            max_asset_count?: number | null
            max_daily_scan_count?: number | null
            max_scan_count?: number | null
            name?: Database['public']['Enums']['subscription_tier_name']
            scan_priority?: number
          }
          Relationships: []
        }
        supabase: {
          Row: {
            description: string | null
            key: string
            value: string
          }
          Insert: {
            description?: string | null
            key: string
            value: string
          }
          Update: {
            description?: string | null
            key?: string
            value?: string
          }
          Relationships: []
        }
        worker: {
          Row: {
            capabilities: Database['public']['Enums']['worker_capability'][]
            is_active: boolean
            name: string
            worker_type: string
          }
          Insert: {
            capabilities: Database['public']['Enums']['worker_capability'][]
            is_active: boolean
            name: string
            worker_type: string
          }
          Update: {
            capabilities?: Database['public']['Enums']['worker_capability'][]
            is_active?: boolean
            name?: string
            worker_type?: string
          }
          Relationships: []
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        env: {
          Args: {
            supabase_key: string
          }
          Returns: string
        }
      }
      Enums: {
        [_ in never]: never
      }
      CompositeTypes: {
        [_ in never]: never
      }
    }
    storage: {
      Tables: {
        buckets: {
          Row: {
            allowed_mime_types: string[] | null
            avif_autodetection: boolean | null
            created_at: string | null
            file_size_limit: number | null
            id: string
            name: string
            owner: string | null
            owner_id: string | null
            public: boolean | null
            updated_at: string | null
          }
          Insert: {
            allowed_mime_types?: string[] | null
            avif_autodetection?: boolean | null
            created_at?: string | null
            file_size_limit?: number | null
            id: string
            name: string
            owner?: string | null
            owner_id?: string | null
            public?: boolean | null
            updated_at?: string | null
          }
          Update: {
            allowed_mime_types?: string[] | null
            avif_autodetection?: boolean | null
            created_at?: string | null
            file_size_limit?: number | null
            id?: string
            name?: string
            owner?: string | null
            owner_id?: string | null
            public?: boolean | null
            updated_at?: string | null
          }
          Relationships: []
        }
        migrations: {
          Row: {
            executed_at: string | null
            hash: string
            id: number
            name: string
          }
          Insert: {
            executed_at?: string | null
            hash: string
            id: number
            name: string
          }
          Update: {
            executed_at?: string | null
            hash?: string
            id?: number
            name?: string
          }
          Relationships: []
        }
        objects: {
          Row: {
            bucket_id: string | null
            created_at: string | null
            id: string
            last_accessed_at: string | null
            metadata: Json | null
            name: string | null
            owner: string | null
            owner_id: string | null
            path_tokens: string[] | null
            updated_at: string | null
            user_metadata: Json | null
            version: string | null
          }
          Insert: {
            bucket_id?: string | null
            created_at?: string | null
            id?: string
            last_accessed_at?: string | null
            metadata?: Json | null
            name?: string | null
            owner?: string | null
            owner_id?: string | null
            path_tokens?: string[] | null
            updated_at?: string | null
            user_metadata?: Json | null
            version?: string | null
          }
          Update: {
            bucket_id?: string | null
            created_at?: string | null
            id?: string
            last_accessed_at?: string | null
            metadata?: Json | null
            name?: string | null
            owner?: string | null
            owner_id?: string | null
            path_tokens?: string[] | null
            updated_at?: string | null
            user_metadata?: Json | null
            version?: string | null
          }
          Relationships: [
            {
              foreignKeyName: 'objects_bucketId_fkey'
              columns: ['bucket_id']
              isOneToOne: false
              referencedRelation: 'buckets'
              referencedColumns: ['id']
            }
          ]
        }
        s3_multipart_uploads: {
          Row: {
            bucket_id: string
            created_at: string
            id: string
            in_progress_size: number
            key: string
            owner_id: string | null
            upload_signature: string
            user_metadata: Json | null
            version: string
          }
          Insert: {
            bucket_id: string
            created_at?: string
            id: string
            in_progress_size?: number
            key: string
            owner_id?: string | null
            upload_signature: string
            user_metadata?: Json | null
            version: string
          }
          Update: {
            bucket_id?: string
            created_at?: string
            id?: string
            in_progress_size?: number
            key?: string
            owner_id?: string | null
            upload_signature?: string
            user_metadata?: Json | null
            version?: string
          }
          Relationships: [
            {
              foreignKeyName: 's3_multipart_uploads_bucket_id_fkey'
              columns: ['bucket_id']
              isOneToOne: false
              referencedRelation: 'buckets'
              referencedColumns: ['id']
            }
          ]
        }
        s3_multipart_uploads_parts: {
          Row: {
            bucket_id: string
            created_at: string
            etag: string
            id: string
            key: string
            owner_id: string | null
            part_number: number
            size: number
            upload_id: string
            version: string
          }
          Insert: {
            bucket_id: string
            created_at?: string
            etag: string
            id?: string
            key: string
            owner_id?: string | null
            part_number: number
            size?: number
            upload_id: string
            version: string
          }
          Update: {
            bucket_id?: string
            created_at?: string
            etag?: string
            id?: string
            key?: string
            owner_id?: string | null
            part_number?: number
            size?: number
            upload_id?: string
            version?: string
          }
          Relationships: [
            {
              foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey'
              columns: ['bucket_id']
              isOneToOne: false
              referencedRelation: 'buckets'
              referencedColumns: ['id']
            },
            {
              foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey'
              columns: ['upload_id']
              isOneToOne: false
              referencedRelation: 's3_multipart_uploads'
              referencedColumns: ['id']
            }
          ]
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        can_insert_object: {
          Args: {
            bucketid: string
            name: string
            owner: string
            metadata: Json
          }
          Returns: undefined
        }
        extension: {
          Args: {
            name: string
          }
          Returns: string
        }
        filename: {
          Args: {
            name: string
          }
          Returns: string
        }
        foldername: {
          Args: {
            name: string
          }
          Returns: string[]
        }
        get_size_by_bucket: {
          Args: Record<PropertyKey, never>
          Returns: {
            size: number
            bucket_id: string
          }[]
        }
        list_multipart_uploads_with_delimiter: {
          Args: {
            bucket_id: string
            prefix_param: string
            delimiter_param: string
            max_keys?: number
            next_key_token?: string
            next_upload_token?: string
          }
          Returns: {
            key: string
            id: string
            created_at: string
          }[]
        }
        list_objects_with_delimiter: {
          Args: {
            bucket_id: string
            prefix_param: string
            delimiter_param: string
            max_keys?: number
            start_after?: string
            next_token?: string
          }
          Returns: {
            name: string
            id: string
            metadata: Json
            updated_at: string
          }[]
        }
        operation: {
          Args: Record<PropertyKey, never>
          Returns: string
        }
        search: {
          Args: {
            prefix: string
            bucketname: string
            limits?: number
            levels?: number
            offsets?: number
            search?: string
            sortcolumn?: string
            sortorder?: string
          }
          Returns: {
            name: string
            id: string
            updated_at: string
            created_at: string
            last_accessed_at: string
            metadata: Json
          }[]
        }
      }
      Enums: {
        [_ in never]: never
      }
      CompositeTypes: {
        [_ in never]: never
      }
    }
  }

  const postgrest = new PostgrestClient<Database>(REST_URL)
  const { data } = await postgrest
    .from('user_profile')
    .select('user_id')
    .eq('email_address', 'some@email-address.com')
    .single()
  let result: Exclude<typeof data, null>
  let expected: {
    user_id: string
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}
