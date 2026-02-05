"""
Journey generation service for creating structured learning journeys.
"""
from typing import List, Dict, Tuple, Optional
import re
from models.resource import Resource
from models.journey import JourneyModel, JourneyStepModel


def analyze_prompt(prompt: str) -> Tuple[str, int, List[str]]:
    """
    Analyze the educator's prompt to extract subject, grade, and keywords.
    
    Args:
        prompt: The educator's lesson description
        
    Returns:
        Tuple of (subject, grade, keywords)
    """
    prompt_lower = prompt.lower()
    
    # Extract subject (default: Science)
    subject = "Science"
    if "french" in prompt_lower or "français" in prompt_lower:
        subject = "French"
    elif "english" in prompt_lower or "writing" in prompt_lower or "reading" in prompt_lower:
        subject = "English"
    elif "math" in prompt_lower or "mathematics" in prompt_lower:
        subject = "Math"
    elif "history" in prompt_lower:
        subject = "History"
    
    # Extract grade (default: 5)
    grade = 5
    grade_match = re.search(r'grade\s*(\d+)', prompt_lower)
    if grade_match:
        grade = int(grade_match.group(1))
    
    # Extract keywords (words longer than 3 characters, excluding common words)
    common_words = {'grade', 'lesson', 'about', 'with', 'from', 'that', 'this', 'have', 'will', 'your', 'their'}
    words = re.findall(r'\b\w+\b', prompt_lower)
    keywords = [w for w in words if len(w) > 3 and w not in common_words]
    
    return subject, grade, keywords


def score_resources(resources: List[Resource], keywords: List[str]) -> List[Tuple[Resource, float]]:
    """
    Score resources based on keyword matching and cultural relevance.
    
    Scoring rules:
    - +2 points for keyword in title
    - +1 point for keyword in description
    - +1 point for keyword in tags
    - x1.5 multiplier for cultural_relevance=True
    
    Args:
        resources: List of resources to score
        keywords: List of keywords from the prompt
        
    Returns:
        List of tuples (resource, score) sorted by score descending
    """
    scored_resources = []
    
    for resource in resources:
        score = 0.0
        
        # Convert resource fields to lowercase for matching
        title_lower = resource.title.lower()
        description_lower = resource.description.lower()
        tags_lower = [tag.lower() for tag in resource.tags]
        
        # Score based on keyword matches
        for keyword in keywords:
            if keyword in title_lower:
                score += 2
            if keyword in description_lower:
                score += 1
            if any(keyword in tag for tag in tags_lower):
                score += 1
        
        # Apply cultural relevance multiplier
        if resource.cultural_relevance:
            score *= 1.5
        
        scored_resources.append((resource, score))
    
    # Sort by score descending
    scored_resources.sort(key=lambda x: x[1], reverse=True)
    
    return scored_resources


def construct_journey(
    scored_resources: List[Tuple[Resource, float]],
    teacher_resources: List[Resource],
    prompt: str,
    subject: str,
    grade: int
) -> JourneyModel:
    """
    Construct a 4-step learning journey from scored resources.
    
    Steps:
    1. Preparation: Teacher resource (guide/sequence/thematic_file)
    2. Hook: Student resource (video/game)
    3. Instruction: Student resource (article/book/video)
    4. Application: Student resource (game/worksheet/podcast)
    
    Args:
        scored_resources: List of (resource, score) tuples for student resources
        teacher_resources: List of teacher resources
        prompt: Original educator prompt
        subject: Extracted subject
        grade: Extracted grade
        
    Returns:
        JourneyModel with 4 steps
    """
    steps = []
    used_ids = set()
    
    # Step 1: Preparation - Select teacher resource
    teacher_types = ['guide', 'sequence', 'thematic_file']
    preparation_resource = None
    
    for resource in teacher_resources:
        if resource.type in teacher_types and resource.id not in used_ids:
            preparation_resource = resource
            used_ids.add(resource.id)
            break
    
    if preparation_resource:
        steps.append(JourneyStepModel(
            step_type="Preparation",
            resource_id=preparation_resource.id
        ))
    
    # Extract just the resources from scored list
    student_resources = [r for r, _ in scored_resources]
    
    # Step 2: Hook - Select engaging resource (video/game)
    hook_types = ['video', 'game']
    hook_resource = None
    
    for resource in student_resources:
        if resource.type in hook_types and resource.id not in used_ids:
            hook_resource = resource
            used_ids.add(resource.id)
            break
    
    # Fallback to any available resource
    if not hook_resource:
        for resource in student_resources:
            if resource.id not in used_ids:
                hook_resource = resource
                used_ids.add(resource.id)
                break
    
    if hook_resource:
        steps.append(JourneyStepModel(
            step_type="Hook",
            resource_id=hook_resource.id
        ))
    
    # Step 3: Instruction - Select informational resource (article/book/video)
    instruction_types = ['article', 'book', 'video']
    instruction_resource = None
    
    for resource in student_resources:
        if resource.type in instruction_types and resource.id not in used_ids:
            instruction_resource = resource
            used_ids.add(resource.id)
            break
    
    # Fallback to any available resource
    if not instruction_resource:
        for resource in student_resources:
            if resource.id not in used_ids:
                instruction_resource = resource
                used_ids.add(resource.id)
                break
    
    if instruction_resource:
        steps.append(JourneyStepModel(
            step_type="Instruction",
            resource_id=instruction_resource.id
        ))
    
    # Step 4: Application - Select practice resource (game/worksheet/podcast)
    application_types = ['game', 'worksheet', 'podcast']
    application_resource = None
    
    for resource in student_resources:
        if resource.type in application_types and resource.id not in used_ids:
            application_resource = resource
            used_ids.add(resource.id)
            break
    
    # Fallback to any available resource
    if not application_resource:
        for resource in student_resources:
            if resource.id not in used_ids:
                application_resource = resource
                used_ids.add(resource.id)
                break
    
    if application_resource:
        steps.append(JourneyStepModel(
            step_type="Application",
            resource_id=application_resource.id
        ))
    
    # Generate journey ID and title
    import time
    journey_id = f"journey-{int(time.time() * 1000)}"
    title = f"Learning Journey: {prompt[:30]}{'...' if len(prompt) > 30 else ''}"
    
    return JourneyModel(
        id=journey_id,
        title=title,
        subject=subject,
        grade=grade,
        prompt=prompt,
        steps=steps
    )