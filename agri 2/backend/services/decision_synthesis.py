from typing import List, Dict, Tuple
from backend.models import FinalDecision, ModelResult, Crop

class DecisionSynthesizer:
    @staticmethod
    def calculate_weighted_score(model_results: List[ModelResult]) -> float:
        """
        Calculate weighted score based on model outputs.
        """
        # Define weights for each model
        weights = {
            "Land Feasibility": 0.15,
            "Soil Analysis": 0.15,
            "Water Balance": 0.20,
            "Climate Analysis": 0.20,
            "Economic Viability": 0.20,
            "Risk Assessment": 0.10
        }
        
        total_score = 0
        total_weight = 0
        
        for result in model_results:
            w = weights.get(result.name, 0.1) # Default weight
            total_score += result.score * w
            total_weight += w
            
        return total_score / total_weight if total_weight > 0 else 0

    @classmethod
    def synthesize(cls, candidate_results: List[Tuple[Crop, List[ModelResult]]]) -> Tuple[FinalDecision, List[FinalDecision]]:
        """
        Synthesize results to find Best Bet, Safe Option, and Risky Option.
        """
        decisions: List[FinalDecision] = []
        
        for crop, results in candidate_results:
            score = cls.calculate_weighted_score(results)
            
            # Determine risk level based on Risk Assessment model
            risk_result = next((r for r in results if r.name == "Risk Assessment"), None)
            risk_level = "Medium"
            if risk_result:
                if risk_result.score < 60: risk_level = "High"
                elif risk_result.score > 80: risk_level = "Low"
            
            # Calculate financials
            revenue = crop.yield_quintal_per_acre * crop.market_price_per_quintal
            profit = revenue - crop.input_cost_per_acre

            decisions.append(FinalDecision(
                crop=crop.name,
                score=round(score, 1),
                profit_per_acre=profit,
                risk_level=risk_level,
                confidence=round(score * 0.95, 1), # Simplified confidence
                recommendation_type="Alternative"
            ))
            
        # Sort by score for Best Bet
        decisions.sort(key=lambda x: x.score, reverse=True)
        
        # 1. Best Bet
        if not decisions:
            return None, []
            
        best_bet = decisions[0]
        best_bet.recommendation_type = "Best Bet"
        
        # 2. Safe Option (Lowest Risk with decent score)
        safe_options = sorted(decisions, key=lambda x: (x.risk_level == "Low", x.score), reverse=True)
        safe_option = next((d for d in safe_options if d.crop != best_bet.crop and d.risk_level == "Low"), None)
        if safe_option:
            safe_option.recommendation_type = "Safe Option"
            
        # 3. High Risk / High Reward (High Profit, High Risk)
        risky_options = sorted(decisions, key=lambda x: x.profit_per_acre, reverse=True)
        risky_option = next((d for d in risky_options if d.crop != best_bet.crop and d.crop != (safe_option.crop if safe_option else "") and d.risk_level == "High"), None)
        if risky_option:
            risky_option.recommendation_type = "High Risk / High Reward"
            
        alternatives = [d for d in decisions if d.crop != best_bet.crop]
        
        # Update alternatives with tags if they were selected as safe/risky
        final_alternatives = []
        if safe_option: final_alternatives.append(safe_option)
        if risky_option: final_alternatives.append(risky_option)
        
        # Add others to fill up to 2 alternatives if needed
        for alt in alternatives:
            if alt not in final_alternatives and len(final_alternatives) < 2:
                final_alternatives.append(alt)

        return best_bet, final_alternatives
