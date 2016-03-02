class DotsController < ApplicationController
  def index
    @dots = Dot.all
  end
  
  def create
    @dot = Dot.create(user_id: current_user.id,
               content:params[:content],
               lat:params[:lat],
               lng:params[:lng],
               stat_id:params[:stat_id])
    render json: @dot
    #render :text => "longitude : #{dot.lng}<br>latitude: #{dot.lat}".html_safe
  end
  
  def destroy
        d = Dot.find(params[:id])
        d.destroy
        render :text => d.id
  end
  

end
