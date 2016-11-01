require 'sinatra'
require 'json'
require 'data_mapper'
require 'dm-serializer'
require 'sinatra/cross_origin'

configure do
  enable :cross_origin
end

options "*" do
  response.headers["Allow"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
  response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"

  response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"
  response.headers["Access-Control-Allow-Origin"] = "*"

  200
end

class GameBoard
  include DataMapper::Resource

  property :id, Serial
  property :uuid, UUID, :key => true, :unique_index => true
  property :currentPlayer, Integer
  property :rows, Text
end

DataMapper.setup(:default, 'sqlite:db/project.db')
GameBoard.auto_upgrade!

get '/api/board/:id' do
  content_type :json
  response.headers["Access-Control-Allow-Origin"] = "*"
  begin
    board = GameBoard.first(uuid: params['id'])
  rescue => e
    status 404
    return {success: false, error: "#{params['id']} not found"}
  end
  board.to_json
end

post '/api/board' do
  content_type :json
  response.headers["Access-Control-Allow-Origin"] = "*"
  board = GameBoard.new
  board.uuid = UUIDTools::UUID.random_create
  board.save
  return board.to_json
end

put '/api/board/:id' do
  content_type :json
  response.headers["Access-Control-Allow-Origin"] = "*"
  begin
    board = GameBoard.first(uuid: params['id'])
  rescue => e
    status 404
    return {success: false, error: "#{params['id']} not found"}
  end
  data = JSON.parse(request.body.read)
  board.currentPlayer = data["currentPlayer"]
  board.rows = data["rows"]
  board.save
  board.to_json
end

