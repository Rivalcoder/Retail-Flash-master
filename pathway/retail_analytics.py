"""
Retail-Flash Pathway Integration
Real-time streaming analytics for retail operations
"""

import pathway as pw
from pathway.stdlib.utils.col import col
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List

class RetailPathwayAnalytics:
    """
    Main Pathway application for Retail-Flash real-time analytics
    """
    
    def __init__(self):
        # Initialize data connectors
        self.setup_connectors()
        
        # Initialize streaming pipelines
        self.setup_pipelines()
        
    def setup_connectors(self):
        """Setup data source connectors"""
        
        # MongoDB connector for products
        self.products_table = pw.io.mongodb.read(
            connection_string=os.getenv("MONGO_URL", "mongodb://localhost:27017"),
            database="retail_flash",
            collection="products",
            schema=pw.schema_from_dict({
                "_id": pw.Type.STRING,
                "name": pw.Type.STRING,
                "price": pw.Type.FLOAT,
                "oldPrice": pw.Type.FLOAT,
                "description": pw.Type.STRING,
                "category": pw.Type.STRING,
                "stock": pw.Type.INT,
                "imageUrl": pw.Type.STRING,
                "promoCopy": pw.Type.STRING,
                "isNew": pw.Type.BOOL,
                "isActive": pw.Type.BOOL,
                "createdBy": pw.Type.STRING,
                "tags": pw.Type.ARRAY(pw.Type.STRING),
                "specifications": pw.Type.JSON,
                "ratings": pw.Type.JSON,
                "createdAt": pw.Type.DATE_TIME,
                "updatedAt": pw.Type.DATE_TIME
            })
        )
        
        # Kafka connector for customer interactions
        self.customer_interactions = pw.io.kafka.read(
            rdkafka_settings={
                "bootstrap.servers": os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092"),
                "group.id": "retail_analytics",
                "auto.offset.reset": "latest"
            },
            topic="customer_interactions",
            schema=pw.schema_from_dict({
                "event_id": pw.Type.STRING,
                "user_id": pw.Type.STRING,
                "product_id": pw.Type.STRING,
                "event_type": pw.Type.STRING,  # view, click, purchase, cart_add, etc.
                "timestamp": pw.Type.DATE_TIME,
                "session_id": pw.Type.STRING,
                "page_url": pw.Type.STRING,
                "referrer": pw.Type.STRING,
                "device_type": pw.Type.STRING,
                "purchase_amount": pw.Type.FLOAT,
                "campaign_id": pw.Type.STRING
            })
        )
        
        # External API connector for market data
        self.market_data = pw.io.http.read(
            url=os.getenv("MARKET_DATA_API_URL", "https://api.marketdata.com/stream"),
            schema=pw.schema_from_dict({
                "timestamp": pw.Type.DATE_TIME,
                "product_category": pw.Type.STRING,
                "competitor_price": pw.Type.FLOAT,
                "market_demand": pw.Type.FLOAT,
                "trend_score": pw.Type.FLOAT
            })
        )
        
    def setup_pipelines(self):
        """Setup all streaming analytics pipelines"""
        
        # Inventory analytics pipeline
        self.inventory_alerts = self.create_inventory_pipeline()
        
        # Dynamic pricing pipeline
        self.pricing_insights = self.create_pricing_pipeline()
        
        # Customer behavior analytics
        self.customer_insights = self.create_customer_analytics_pipeline()
        
        # Campaign performance analytics
        self.campaign_analytics = self.create_campaign_pipeline()
        
        # AI-powered recommendations
        self.product_recommendations = self.create_recommendations_pipeline()
        
    def create_inventory_pipeline(self):
        """Real-time inventory monitoring and alerts"""
        
        # Stream product updates
        product_updates = self.products_table.select(
            product_id=col("_id"),
            name=col("name"),
            stock=col("stock"),
            price=col("price"),
            category=col("category"),
            timestamp=col("updatedAt")
        )
        
        # Calculate stock velocity (units sold per day)
        stock_velocity = product_updates.groupby(
            col("product_id")
        ).reduce(
            product_id=col("product_id"),
            name=col("name").last(),
            current_stock=col("stock").last(),
            avg_daily_sales=pw.reducers.avg(col("stock_change")),
            last_updated=col("timestamp").last(),
            category=col("category").last()
        )
        
        # Generate low stock alerts
        low_stock_alerts = stock_velocity.filter(
            col("current_stock") < 10  # Threshold for low stock
        ).select(
            alert_type="LOW_STOCK",
            product_id=col("product_id"),
            product_name=col("name"),
            current_stock=col("current_stock"),
            urgency_level=pw.if_else(
                col("current_stock") < 5,
                "CRITICAL",
                "WARNING"
            ),
            recommended_action=pw.if_else(
                col("current_stock") < 5,
                "IMMEDIATE_REORDER",
                "PLAN_REORDER"
            ),
            timestamp=pw.datetime.now()
        )
        
        # Calculate inventory value
        inventory_value = product_updates.groupby(
            col("category")
        ).reduce(
            category=col("category"),
            total_products=pw.reducers.count(),
            total_value=pw.reducers.sum(col("stock") * col("price")),
            avg_stock_level=pw.reducers.avg(col("stock"))
        )
        
        return {
            "alerts": low_stock_alerts,
            "value": inventory_value,
            "velocity": stock_velocity
        }
    
    def create_pricing_pipeline(self):
        """Dynamic pricing based on demand and market conditions"""
        
        # Analyze demand patterns from customer interactions
        demand_analysis = self.customer_interactions.groupby(
            col("product_id")
        ).reduce(
            product_id=col("product_id"),
            views_last_hour=pw.reducers.count_where(
                col("event_type") == "view" & 
                col("timestamp") > pw.datetime.now() - pw.duration.hours(1)
            ),
            purchases_last_day=pw.reducers.count_where(
                col("event_type") == "purchase" & 
                col("timestamp") > pw.datetime.now() - pw.duration.days(1)
            ),
            cart_adds_last_day=pw.reducers.count_where(
                col("event_type") == "cart_add" & 
                col("timestamp") > pw.datetime.now() - pw.duration.days(1)
            ),
            avg_purchase_amount=pw.reducers.avg(col("purchase_amount"))
        )
        
        # Join with product data for pricing analysis
        pricing_data = demand_analysis.join(
            self.products_table.select(
                product_id=col("_id"),
                current_price=col("price"),
                old_price=col("oldPrice"),
                category=col("category")
            ),
            col("product_id") == col("product_id")
        )
        
        # Generate pricing recommendations
        pricing_recommendations = pricing_data.select(
            product_id=col("product_id"),
            current_price=col("current_price"),
            recommended_price=pw.if_else(
                col("purchases_last_day") > 10 & col("views_last_hour") > 50,
                col("current_price") * 1.1,  # Increase price if high demand
                pw.if_else(
                    col("purchases_last_day") < 2 & col("views_last_hour") > 20,
                    col("current_price") * 0.95,  # Decrease price if low conversion
                    col("current_price")  # Maintain current price
                )
            ),
            demand_score=pw.min(col("views_last_hour") / 100, 1.0),
            conversion_rate=col("purchases_last_day") / pw.max(col("views_last_hour"), 1),
            price_change_percentage=(
                col("recommended_price") - col("current_price")
            ) / col("current_price") * 100,
            confidence_score=pw.min(
                (col("views_last_hour") + col("purchases_last_day")) / 200, 
                1.0
            )
        )
        
        return pricing_recommendations
    
    def create_customer_analytics_pipeline(self):
        """Real-time customer behavior analytics"""
        
        # Session analytics
        session_analytics = self.customer_interactions.groupby(
            col("session_id")
        ).reduce(
            session_id=col("session_id"),
            user_id=col("user_id").first(),
            session_start=col("timestamp").min(),
            session_end=col("timestamp").max(),
            session_duration=pw.apply(
                lambda start, end: (end - start).total_seconds(),
                col("timestamp").min(),
                col("timestamp").max()
            ),
            page_views=pw.reducers.count_where(col("event_type") == "view"),
            purchases=pw.reducers.count_where(col("event_type") == "purchase"),
            total_spent=pw.reducers.sum(col("purchase_amount")),
            products_viewed=pw.reducers.count_distinct(col("product_id"))
        )
        
        # Customer lifetime value calculation
        customer_lifetime_value = self.customer_interactions.groupby(
            col("user_id")
        ).reduce(
            user_id=col("user_id"),
            total_purchases=pw.reducers.count_where(col("event_type") == "purchase"),
            total_spent=pw.reducers.sum(col("purchase_amount")),
            avg_order_value=pw.reducers.avg(col("purchase_amount")),
            first_purchase=col("timestamp").min(),
            last_purchase=col("timestamp").max(),
            days_since_last_purchase=pw.apply(
                lambda last: (pw.datetime.now() - last).days,
                col("timestamp").max()
            )
        ).select(
            user_id=col("user_id"),
            total_purchases=col("total_purchases"),
            total_spent=col("total_spent"),
            avg_order_value=col("avg_order_value"),
            customer_segment=pw.if_else(
                col("total_spent") > 1000,
                "VIP",
                pw.if_else(
                    col("total_spent") > 500,
                    "Regular",
                    "New"
                )
            ),
            churn_risk=pw.if_else(
                col("days_since_last_purchase") > 30,
                "HIGH",
                pw.if_else(
                    col("days_since_last_purchase") > 7,
                    "MEDIUM",
                    "LOW"
                )
            )
        )
        
        return {
            "sessions": session_analytics,
            "customer_value": customer_lifetime_value
        }
    
    def create_campaign_pipeline(self):
        """Real-time campaign performance analytics"""
        
        # Campaign performance tracking
        campaign_performance = self.customer_interactions.filter(
            col("campaign_id").is_not_null()
        ).groupby(
            col("campaign_id")
        ).reduce(
            campaign_id=col("campaign_id"),
            impressions=pw.reducers.count_where(col("event_type") == "view"),
            clicks=pw.reducers.count_where(col("event_type") == "click"),
            conversions=pw.reducers.count_where(col("event_type") == "purchase"),
            revenue=pw.reducers.sum(col("purchase_amount")),
            unique_users=pw.reducers.count_distinct(col("user_id"))
        ).select(
            campaign_id=col("campaign_id"),
            impressions=col("impressions"),
            clicks=col("clicks"),
            conversions=col("conversions"),
            revenue=col("revenue"),
            unique_users=col("unique_users"),
            ctr=col("clicks") / pw.max(col("impressions"), 1),
            conversion_rate=col("conversions") / pw.max(col("clicks"), 1),
            revenue_per_user=col("revenue") / pw.max(col("unique_users"), 1),
            performance_score=pw.apply(
                self.calculate_campaign_score,
                col("ctr"),
                col("conversion_rate"),
                col("revenue_per_user")
            )
        )
        
        return campaign_performance
    
    def create_recommendations_pipeline(self):
        """AI-powered product recommendations"""
        
        # User-product interaction matrix
        user_product_interactions = self.customer_interactions.groupby(
            col("user_id"), col("product_id")
        ).reduce(
            user_id=col("user_id"),
            product_id=col("product_id"),
            interaction_count=pw.reducers.count(),
            last_interaction=col("timestamp").max(),
            interaction_types=pw.reducers.count_distinct(col("event_type"))
        )
        
        # Collaborative filtering recommendations
        recommendations = user_product_interactions.join(
            self.products_table.select(
                product_id=col("_id"),
                name=col("name"),
                category=col("category"),
                price=col("price"),
                is_active=col("isActive")
            ),
            col("product_id") == col("product_id")
        ).filter(
            col("is_active") == True
        ).select(
            user_id=col("user_id"),
            product_id=col("product_id"),
            product_name=col("name"),
            category=col("category"),
            price=col("price"),
            interaction_score=col("interaction_count") * col("interaction_types"),
            recommendation_score=pw.apply(
                self.calculate_recommendation_score,
                col("interaction_count"),
                col("interaction_types"),
                col("price")
            )
        )
        
        return recommendations
    
    def calculate_campaign_score(self, ctr: float, conversion_rate: float, revenue_per_user: float) -> float:
        """Calculate overall campaign performance score"""
        # Normalize metrics and calculate weighted score
        normalized_ctr = min(ctr * 100, 1.0)  # Convert to percentage, cap at 100%
        normalized_conversion = min(conversion_rate * 100, 1.0)
        normalized_revenue = min(revenue_per_user / 100, 1.0)  # Normalize to 0-1 scale
        
        # Weighted score (CTR: 30%, Conversion: 40%, Revenue: 30%)
        score = (normalized_ctr * 0.3 + normalized_conversion * 0.4 + normalized_revenue * 0.3)
        return round(score, 3)
    
    def calculate_recommendation_score(self, interactions: int, types: int, price: float) -> float:
        """Calculate product recommendation score"""
        # Base score from interactions
        base_score = interactions * types
        
        # Price factor (prefer mid-range products)
        price_factor = 1.0 if 50 <= price <= 500 else 0.8
        
        return base_score * price_factor
    
    def run(self):
        """Run the Pathway application"""
        
        # Output streams to various destinations
        pw.io.jsonlines.write(
            self.inventory_alerts["alerts"],
            "outputs/inventory_alerts.jsonl"
        )
        
        pw.io.jsonlines.write(
            self.pricing_insights,
            "outputs/pricing_insights.jsonl"
        )
        
        pw.io.jsonlines.write(
            self.campaign_analytics,
            "outputs/campaign_analytics.jsonl"
        )
        
        pw.io.jsonlines.write(
            self.product_recommendations,
            "outputs/recommendations.jsonl"
        )
        
        # WebSocket output for real-time dashboard
        pw.io.websocket.write(
            self.inventory_alerts["alerts"],
            "ws://localhost:8080/inventory"
        )
        
        pw.io.websocket.write(
            self.pricing_insights,
            "ws://localhost:8080/pricing"
        )
        
        # Start the Pathway application
        pw.run()

if __name__ == "__main__":
    # Initialize and run the analytics application
    analytics = RetailPathwayAnalytics()
    analytics.run() 