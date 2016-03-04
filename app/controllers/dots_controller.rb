class DotsController < ApplicationController
  
  # GET /dots
  # GET /dots.json
  def index
    @dots = Dot.all
  end
  
  # GET /dots/1
  # GET /dots/1.json
  def show
    @dot = Dot.find(params[:id])
  end
  
  def create
    dot = Dot.create(user_id: current_user.id,
               content: params[:content],
               lat: params[:lat],
               lng: params[:lng],
               address: params[:address],
               stat_id: params[:stat_id])
    render json: dot
    #render :text => "longitude : #{dot.lng}<br>latitude: #{dot.lat}".html_safe
  end
  
  def destroy
        d = Dot.find(params[:id])
        d.destroy
        render :text => d.id
  end
  
  def update
    dot1 = Dot.find(params[:id])
    dot1.lat = params[:lat]
    dot1.lng = params[:lng]
    dot1.address = params[:address]
    dot1.content = params[:content]
    dot1.stat_id = params[:stat_id]
    dot1.save
    render json: dot1
  end

end
