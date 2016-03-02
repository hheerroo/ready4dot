json.array!(@dots) do |dot|
  json.extract! dot, :id, :user_id, :content, :lat, :lng, :stat_id
  json.url dot_url(dot, format: :json)
end