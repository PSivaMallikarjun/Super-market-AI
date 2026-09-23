import os


from crewai import LLM
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import (
	FileReadTool,
	ExaSearchTool,
	OCRTool
)






@CrewBase
class SupermarketaiCrew:
    """Supermarketai crew"""

    
    @agent
    def supermarket_live_data_integration_architect(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["supermarket_live_data_integration_architect"],
            
            
            tools=[				FileReadTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def supermarket_analytics_dashboard_specialist(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["supermarket_analytics_dashboard_specialist"],
            
            
            tools=[				FileReadTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def digital_storefront_layout_specialist(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["digital_storefront_layout_specialist"],
            
            
            tools=[				ExaSearchTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def inventory_management_demand_forecasting_specialist(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["inventory_management_demand_forecasting_specialist"],
            
            
            tools=[				FileReadTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def out_of_stock_prediction_specialist(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["out_of_stock_prediction_specialist"],
            
            
            tools=[				FileReadTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def computer_vision_shelf_cctv_operations_analyst(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["computer_vision_shelf_cctv_operations_analyst"],
            
            
            tools=[				FileReadTool(),
				OCRTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def retail_compliance_planogram_quality_auditor(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["retail_compliance_planogram_quality_auditor"],
            
            
            tools=[				FileReadTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def retail_customer_behaviour_footfall_analyst(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["retail_customer_behaviour_footfall_analyst"],
            
            
            tools=[				FileReadTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def promotions_analyst_retail_marketing_content_creator(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["promotions_analyst_retail_marketing_content_creator"],
            
            
            tools=[				ExaSearchTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def loss_prevention_security_intelligence_analyst(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["loss_prevention_security_intelligence_analyst"],
            
            
            tools=[				FileReadTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def supermarket_ai_customer_support_specialist(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["supermarket_ai_customer_support_specialist"],
            
            
            tools=[				ExaSearchTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def supermarketai_system_health_integration_monitor(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["supermarketai_system_health_integration_monitor"],
            
            
            tools=[				FileReadTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    
    @agent
    def supermarketai_executive_report_compiler(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["supermarketai_executive_report_compiler"],
            
            
            tools=[				FileReadTool()],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-5.6-luna",
                
                
            ),
            
        )
        
    

    
    @task
    def generate_full_store_dataset(self) -> Task:
        return Task(
            config=self.tasks_config["generate_full_store_dataset"],
            markdown=False,
            
            
        )
    
    @task
    def generate_dashboard_app_tour(self) -> Task:
        return Task(
            config=self.tasks_config["generate_dashboard_app_tour"],
            markdown=False,
            
            
        )
    
    @task
    def design_storefront_layout(self) -> Task:
        return Task(
            config=self.tasks_config["design_storefront_layout"],
            markdown=False,
            
            
        )
    
    @task
    def inventory_analysis_demand_forecast(self) -> Task:
        return Task(
            config=self.tasks_config["inventory_analysis_demand_forecast"],
            markdown=False,
            
            
        )
    
    @task
    def live_visual_shelf_tracking_monitoring(self) -> Task:
        return Task(
            config=self.tasks_config["live_visual_shelf_tracking_monitoring"],
            markdown=False,
            
            
        )
    
    @task
    def customer_behaviour_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["customer_behaviour_analysis"],
            markdown=False,
            
            
        )
    
    @task
    def system_health_check(self) -> Task:
        return Task(
            config=self.tasks_config["system_health_check"],
            markdown=False,
            
            
        )
    
    @task
    def predict_out_of_stock_events(self) -> Task:
        return Task(
            config=self.tasks_config["predict_out_of_stock_events"],
            markdown=False,
            
            
        )
    
    @task
    def theft_shrinkage_security_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["theft_shrinkage_security_analysis"],
            markdown=False,
            
            
        )
    
    @task
    def compliance_quality_full_audit(self) -> Task:
        return Task(
            config=self.tasks_config["compliance_quality_full_audit"],
            markdown=False,
            
            
        )
    
    @task
    def promo_monitoring_marketing_generation(self) -> Task:
        return Task(
            config=self.tasks_config["promo_monitoring_marketing_generation"],
            markdown=False,
            
            
        )
    
    @task
    def respond_to_customer_support_query(self) -> Task:
        return Task(
            config=self.tasks_config["respond_to_customer_support_query"],
            markdown=False,
            
            
        )
    
    @task
    def compile_master_supermarketai_operational_report(self) -> Task:
        return Task(
            config=self.tasks_config["compile_master_supermarketai_operational_report"],
            markdown=False,
            
            
        )
    

    @crew
    def crew(self) -> Crew:
        """Creates the Supermarketai crew"""

        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,

            chat_llm=LLM(model="openai/gpt-5.6-luna"),
        )


