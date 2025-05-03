def get_project_count() -> int:
    try:
        projects = MongoDB.find_many(db_name="iddb", collection_name="project", query={})
        return len(projects)
    except Exception as e:
        print("❌ Error counting projects:", e)
        return 0

get_project_count()