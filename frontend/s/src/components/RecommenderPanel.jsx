import React, { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import { Upload, Sparkles, TrendingUp, ChevronDown, Loader2, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { API_BACKEND } from "../api";

const Input = (props) => (
  <input
    {...props}
    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white"
  />
);

const Select = (props) => (
  <div className="relative">
    <select
      {...props}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white appearance-none transition-all duration-200"
    >
      {props.children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
  </div>
);

const Button = ({ children, variant = "primary", icon: Icon, ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-600 via-cyan-800 to-cyan-600 hover:from-cyan-800 hover:via-cyan-600 hover:to-cyan-800 text-white shadow-lg shadow-blue-500/30 cursor-pointer",
    secondary: "bg-white border-2 border-gray-200 hover:border-cyan-500 text-gray-700 hover:text-blue-600"
  };

  return (
    <button
      {...props}
      className={`w-full px-6 py-3.5 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${variants[variant]}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

const Card = ({ children, className, gradient = false }) => (
  <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${gradient ? 'bg-gradient-to-br from-white to-blue-50' : ''} ${className || ""}`}>
    {children}
  </div>
);

const SchemaMapper = ({ title, headers, schema, onChange, schemaKeys }) => (
  <div className="mt-5 p-5 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl">
    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
      <Sparkles className="w-4 h-4 mr-2 text-cyan-600" />
      {title}
    </h3>
    <div className="space-y-4">
      {schemaKeys.map(({ key, label, multi }) => (
        <div key={key}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
          <Select
            multiple={multi}
            value={schema[key]}
            onChange={(e) => {
              const value = multi
                ? Array.from(e.target.selectedOptions, (opt) => opt.value)
                : e.target.value;
              onChange({ ...schema, [key]: value });
            }}
            className={multi ? "h-28" : ""}
          >
            {!multi && <option value="">Select a column...</option>}
            {headers.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </Select>
          {multi && (
            <p className="text-xs text-gray-500 mt-2 italic">
              Hold Ctrl/Cmd to select multiple columns
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
);

function RecommenderPanel() {
  const [projectName, setProjectName] = useState("");
  const [contentFile, setContentFile] = useState(null);
  const [interactionFile, setInteractionFile] = useState(null);

  const [contentHeaders, setContentHeaders] = useState([]);
  const [interactionHeaders, setInteractionHeaders] = useState([]);

  const [contentSchema, setContentSchema] = useState({
    item_id: "",
    item_title: "",
    feature_cols: [],
  });
  const [interactionSchema, setInteractionSchema] = useState({
    user_id: "",
    item_id: "",
    rating: "",
  });

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [itemsList, setItemsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedItemTitle, setSelectedItemTitle] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const parseHeaders = (file, setHeaders) => {
    if (file) {
      Papa.parse(file, {
        header: true,
        preview: 1,
        complete: (results) => setHeaders(results.meta.fields || []),
      });
    } else {
      setHeaders([]);
    }
  };

  useEffect(() => parseHeaders(contentFile, setContentHeaders), [contentFile]);
  useEffect(
    () => parseHeaders(interactionFile, setInteractionHeaders),
    [interactionFile]
  );

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`${API_BACKEND}/projects/`);
      if (!response.ok) {
        setProjects([]);
        return;
      }
      let data;
      try {
        data = await response.json();
      } catch {
        setProjects([]);
        return;
      }
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (currentStatus === "processing" && selectedProjectId) {
      const interval = setInterval(
        () => checkProjectStatus(selectedProjectId),
        3000
      );
      return () => clearInterval(interval);
    }
  }, [currentStatus, selectedProjectId]);

  const checkProjectStatus = async (projectId) => {
    try {
      const response = await fetch(`${API_BACKEND}/project/${projectId}/status`);
      if (!response.ok) throw new Error("Failed to get status");
      const data = await response.json();

      setCurrentStatus(data.status);
      setProjects((prev) => prev.map((p) => (p.id === projectId ? data : p)));

      if (data.status === "ready") {
        handleSelectProject(data.id);
      }
      if (data.status === "error") {
        setErrorMessage("Project processing failed.");
      }
    } catch (error) {
      console.error("Status check failed:", error);
      setCurrentStatus("error");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName || (!contentFile && !interactionFile)) {
      setErrorMessage("Project name and at least one file are required.");
      return;
    }

    setErrorMessage("");
    setCurrentStatus("uploading");
    setRecommendations(null);

    const formData = new FormData();
    formData.append("project_name", projectName);

    if (contentFile) {
      formData.append("content_file", contentFile);
      formData.append("content_schema_json", JSON.stringify(contentSchema));
    }
    if (interactionFile) {
      formData.append("interaction_file", interactionFile);
      formData.append(
        "interaction_schema_json",
        JSON.stringify(interactionSchema)
      );
    }

    try {
      const response = await fetch(`${API_BACKEND}/create-project/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let detail = "Upload failed";
        try {
          const err = await response.json();
          detail = err.detail || (typeof err === "string" ? err : detail);
        } catch (_) {}
        throw new Error(detail);
      }

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response from server");
      }
      setSelectedProjectId(data.id);
      setCurrentStatus("processing");
      fetchProjects();
    } catch (error) {
      setErrorMessage(error.message);
      setCurrentStatus("error");
    }
  };

  const handleSelectProject = async (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    setSelectedProjectId(projectId);
    setCurrentStatus(project.status);
    setRecommendations(null);
    setErrorMessage("");
    setItemsList([]);
    setUsersList([]);

    if (project.status === "ready" && project.model_type) {
      if (["content", "hybrid"].includes(project.model_type)) {
        try {
          const res = await fetch(`${API_BACKEND}/project/${projectId}/items`);
          if (!res.ok) return;
          const data = await res.json();
          const list = Array.isArray(data) ? data : [];
          setItemsList(list);
          setSelectedItemTitle(list[0]?.title || "");
        } catch (e) {
          console.error("Failed to fetch items");
          setItemsList([]);
        }
      }
      if (["collaborative", "hybrid"].includes(project.model_type)) {
        try {
          const res = await fetch(`${API_BACKEND}/project/${projectId}/users`);
          if (!res.ok) return;
          const data = await res.json();
          const list = Array.isArray(data) ? data : [];
          setUsersList(list);
          setSelectedUserId(list[0]?.id || "");
        } catch (e) {
          console.error("Failed to fetch users");
          setUsersList([]);
        }
      }
    }
  };

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    setIsLoadingRecs(true);
    setRecommendations(null);
    setErrorMessage("");

    const params = new URLSearchParams();
    if (["content", "hybrid"].includes(selectedProject.model_type)) {
      params.append("item_title", selectedItemTitle);
    }
    if (["collaborative", "hybrid"].includes(selectedProject.model_type)) {
      params.append("user_id", selectedUserId);
    }

    try {
      params.append("n", "10");
      const url = `${API_BACKEND}/project/${selectedProjectId}/recommendations?${params.toString()}`;
      console.log("Fetching recommendations:", url);

      const response = await fetch(url);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const err = await response.json();
        console.error("Recommendation error:", err);
        throw new Error(err.detail || "Failed to get recommendations");
      }

      const data = await response.json();
      console.log("Recommendation data:", data);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Recommendation error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card gradient>
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-900 via-cyan-800 to-cyan-900 rounded-4xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create New Project
                  </h2>
                  <p className="text-sm text-gray-600">Build your AI-powered recommendation engine</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Project Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., My Movie Recommender"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 border-dashed border-red-900 rounded-2xl bg-gradient-to-br from-blue-50 to-white hover:border-cyan-400 transition-all duration-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Upload className="w-5 h-5 text-rose-950" />
                      <h3 className="font-bold text-lg text-gray-800">
                        Content Data
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload item details (e.g., movies.csv)
                    </p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) =>
                        setContentFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                    {contentFile && (
                      <SchemaMapper
                        title="Map Content Schema"
                        headers={contentHeaders}
                        schema={contentSchema}
                        onChange={setContentSchema}
                        schemaKeys={[
                          { key: "item_id", label: "Item ID Column" },
                          { key: "item_title", label: "Item Title Column" },
                          {
                            key: "feature_cols",
                            label: "Feature Columns",
                            multi: true,
                          },
                        ]}
                      />
                    )}
                  </div>

                  <div className="p-6 border-2 border-dashed border-red-900 rounded-2xl bg-gradient-to-br from-indigo-50 to-white hover:border-cyan-400 transition-all duration-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-rose-900" />
                      <h3 className="font-bold text-lg text-gray-800">
                        Interaction Data
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload user ratings (e.g., ratings.csv)
                    </p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) =>
                        setInteractionFile(
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                    {interactionFile && (
                      <SchemaMapper
                        title="Map Interaction Schema"
                        headers={interactionHeaders}
                        schema={interactionSchema}
                        onChange={setInteractionSchema}
                        schemaKeys={[
                          { key: "user_id", label: "User ID Column" },
                          { key: "item_id", label: "Item ID Column" },
                          { key: "rating", label: "Rating Column" },
                        ]}
                      />
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleCreateProject}
                  disabled={
                    currentStatus === "uploading" ||
                    currentStatus === "processing"
                  }
                  icon={currentStatus === "uploading" || currentStatus === "processing" ? Loader2 : Sparkles}
                >
                  {currentStatus === "uploading" && "Uploading Files..."}
                  {currentStatus === "processing" && "Training Model..."}
                  {currentStatus !== "uploading" &&
                    currentStatus !== "processing" &&
                    "Create Project & Train Model"}
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-900 to-cyan-800 rounded-4xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Get Recommendations
                  </h2>
                  <p className="text-sm text-gray-600">Generate personalized suggestions</p>
                </div>
              </div>
              
              {!selectedProjectId ? (
                <div className="text-center p-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    Please select a "Ready" project to begin
                  </p>
                </div>
              ) : currentStatus === "processing" ? (
                <div className="text-center p-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                  <p className="font-semibold text-blue-600 text-lg">
                    Processing your project...
                  </p>
                  <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
                </div>
              ) : errorMessage ? (
                <div className="p-6 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm mt-1">{errorMessage}</p>
                  </div>
                </div>
              ) : currentStatus === "ready" && selectedProject ? (
                <div className="space-y-6">
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {selectedProject.project_name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Model Type:</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        selectedProject.model_type === "content"
                          ? "bg-green-100 text-green-800"
                          : selectedProject.model_type === "collaborative"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {selectedProject.model_type?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {(selectedProject.model_type === "content" ||
                    selectedProject.model_type === "hybrid") && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Item
                      </label>
                      <Select
                        value={selectedItemTitle}
                        onChange={(e) => setSelectedItemTitle(e.target.value)}
                      >
                        {itemsList.map((item) => (
                          <option key={item.id} value={item.title}>
                            {item.title}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}
                  
                  {(selectedProject.model_type === "collaborative" ||
                    selectedProject.model_type === "hybrid") && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select User
                      </label>
                      <Select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                      >
                        {usersList.map((user) => (
                          <option key={user.id} value={user.id}>
                            User {user.id}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}

                  <Button
                    onClick={handleGetRecommendations}
                    disabled={isLoadingRecs}
                    icon={isLoadingRecs ? Loader2 : Play}
                  >
                    {isLoadingRecs
                      ? "Generating..."
                      : "Get Recommendations"}
                  </Button>

                  {recommendations && (
                    <div className="pt-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">Top Recommendations</h3>
                      </div>
                      <div className="space-y-2">
                        {recommendations.map((rec, index) => {
                          const titleKey = Object.keys(rec).find(
                            (k) =>
                              k.toLowerCase().includes("title") ||
                              k.toLowerCase().includes("name")
                          );
                          const idKey = Object.keys(rec).find((k) =>
                            k.toLowerCase().includes("id")
                          );
                          return (
                            <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-indigo-200 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {index + 1}
                                </div>
                                <p className="text-gray-900 font-medium">
                                  {titleKey ? rec[titleKey] : `ID: ${rec[idKey]}`}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <Card className="lg:col-span-1 h-fit sticky top-24">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Projects</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {projects.length === 0 && (
                <div className="text-center p-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">No projects yet</p>
                  <p className="text-xs text-gray-400 mt-1">Create one to get started</p>
                </div>
              )}
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProject(p.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedProjectId === p.id
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-rose-800 shadow-md"
                      : "hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded-md">
                      #{p.id}
                    </span>
                    <span
                      className={`flex items-center space-x-1 text-xs font-bold ${
                        p.status === "ready"
                          ? "text-green-600"
                          : p.status === "error"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {p.status === "ready" && <CheckCircle className="w-3 h-3" />}
                      {p.status === "processing" && <Loader2 className="w-3 h-3 animate-spin" />}
                      {p.status === "error" && <AlertCircle className="w-3 h-3" />}
                      <span className="uppercase">{p.status}</span>
                    </span>
                  </div>
                  <div className="font-bold text-gray-900 mb-2">
                    {p.project_name}
                  </div>
                  <span
                    className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      p.model_type === "content"
                        ? "bg-green-100 text-green-800"
                        : p.model_type === "collaborative"
                        ? "bg-yellow-100 text-yellow-800"
                        : p.model_type === "hybrid"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {p.model_type || "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default RecommenderPanel;