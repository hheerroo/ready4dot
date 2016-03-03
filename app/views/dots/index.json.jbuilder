json.array!(@dots) do |dot|
  json.extract! dot, :id, :user_id, :content, :lat, :lng, :stat_id, :created_at, :updated_at
  json.url dot_url(dot, format: :json)
end

